import { OwnerincChatwootIcon } from '@/ownerinc/components/OwnerincChatwootIcon';
import {
  OWNERINC_CHATWOOT_LABEL,
  OWNERINC_CHATWOOT_URL,
} from '@/ownerinc/constants/ownerincChatwoot.constants';
import { NavigationDrawerItem } from '@/ui/navigation/navigation-drawer/components/NavigationDrawerItem';
import { styled } from '@linaria/react';
import { IconExternalLink } from 'twenty-ui/icon';
import { themeCssVariables } from 'twenty-ui/theme-constants';

export const CHATWOOT_BRAND_BLUE = '#47A7F6';

const StyledExternalLinkIcon = styled(IconExternalLink)`
  color: ${CHATWOOT_BRAND_BLUE};
  flex-shrink: 0;
  margin-right: ${themeCssVariables.spacing[1]};
`;

export const OwnerincChatwootLauncher = () => (
  <NavigationDrawerItem
    alwaysShowRightOptions
    className="ownerinc-chatwoot-launcher"
    Icon={OwnerincChatwootIcon}
    label={OWNERINC_CHATWOOT_LABEL}
    rightOptions={
      <StyledExternalLinkIcon aria-hidden size={16} stroke={1.75} />
    }
    to={OWNERINC_CHATWOOT_URL}
  />
);
