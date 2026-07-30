import { currentUserWorkspaceState } from '@/auth/states/currentUserWorkspaceState';
import {
  WorkspaceActivationStatus,
  PermissionFlagType,
} from '~/generated-metadata/graphql';
import { currentWorkspaceState } from '@/auth/states/currentWorkspaceState';
import { useAtomStateValue } from '@/ui/utilities/state/jotai/hooks/useAtomStateValue';

const OWNERINC_DISABLED_PERMISSION_FLAGS = new Set<PermissionFlagType>([
  PermissionFlagType.AI,
  PermissionFlagType.AI_SETTINGS,
]);

export const useHasPermissionFlag = (
  permissionFlagKey?: PermissionFlagType,
) => {
  const currentWorkspace = useAtomStateValue(currentWorkspaceState);
  const currentUserWorkspace = useAtomStateValue(currentUserWorkspaceState);

  if (!permissionFlagKey) {
    return true;
  }

  if (OWNERINC_DISABLED_PERMISSION_FLAGS.has(permissionFlagKey)) {
    return false;
  }

  if (
    permissionFlagKey === PermissionFlagType.WORKSPACE &&
    currentWorkspace?.activationStatus ===
      WorkspaceActivationStatus.PENDING_CREATION
  ) {
    return true;
  }

  const userFlags = currentUserWorkspace?.permissionFlags ?? [];
  return userFlags.includes(permissionFlagKey);
};
