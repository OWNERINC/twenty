import { OwnerincChatwootIcon } from '@/ownerinc/components/OwnerincChatwootIcon';
import {
  OWNERINC_CHATWOOT_LABEL,
  OWNERINC_CHATWOOT_URL,
} from '@/ownerinc/constants/ownerincChatwoot.constants';
import { useNavigationDrawerExpanded } from '@/navigation/hooks/useNavigationDrawerExpanded';
import { isNavigationDrawerExpandedState } from '@/ui/navigation/states/isNavigationDrawerExpanded';
import { useAtomStateValue } from '@/ui/utilities/state/jotai/hooks/useAtomStateValue';
import { styled } from '@linaria/react';
import { IconExternalLink } from 'twenty-ui/icon';
import {
  AppTooltip,
  TooltipDelay,
  TooltipPosition,
} from 'twenty-ui/surfaces';
import { themeCssVariables } from 'twenty-ui/theme-constants';
import { useIsMobile } from 'twenty-ui/utilities';

const OWNERINC_CHATWOOT_LAUNCHER_ID = 'ownerinc-chatwoot-launcher';

// Slightly darker than Chatwoot's logo blue so white text meets WCAG AA.
const CHATWOOT_ACCESSIBLE_BLUE = '#1D6FD1';
const CHATWOOT_ACCESSIBLE_BLUE_HOVER = '#175EAF';
const CHATWOOT_ACCESSIBLE_BLUE_PRESSED = '#124C8F';

const StyledLauncher = styled.a<{ isExpanded: boolean }>`
  align-items: center;
  background: ${CHATWOOT_ACCESSIBLE_BLUE};
  border: 1px solid transparent;
  border-radius: ${themeCssVariables.border.radius.pill};
  box-sizing: border-box;
  color: white;
  cursor: pointer;
  display: grid;
  font-size: ${themeCssVariables.font.size.sm};
  font-weight: ${themeCssVariables.font.weight.semiBold};
  grid-template-columns: ${({ isExpanded }) =>
    isExpanded ? '20px minmax(0, 1fr) 16px' : '20px'};
  height: ${themeCssVariables.spacing[11]};
  justify-content: center;
  justify-items: center;
  line-height: 1;
  padding: ${({ isExpanded }) =>
    isExpanded ? `0 ${themeCssVariables.spacing[3]}` : '0'};
  text-decoration: none;
  transition:
    background calc(${themeCssVariables.animation.duration.fast} * 1s) ease,
    box-shadow calc(${themeCssVariables.animation.duration.fast} * 1s) ease;
  width: ${({ isExpanded }) =>
    isExpanded ? '100%' : themeCssVariables.spacing[8]};

  &:hover {
    background: ${CHATWOOT_ACCESSIBLE_BLUE_HOVER};
  }

  &:active {
    background: ${CHATWOOT_ACCESSIBLE_BLUE_PRESSED};
  }

  &:focus-visible {
    box-shadow:
      0 0 0 2px ${themeCssVariables.background.primary},
      0 0 0 4px ${CHATWOOT_ACCESSIBLE_BLUE};
    outline: none;
  }
`;

const StyledLabel = styled.span`
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

export const OwnerincChatwootLauncher = () => {
  const isMobile = useIsMobile();
  const isNavigationDrawerExpanded = useAtomStateValue(
    isNavigationDrawerExpandedState,
  );
  const isExpanded = useNavigationDrawerExpanded();

  return (
    <>
      <StyledLauncher
        aria-label="Abrir Chatwoot em nova aba"
        data-testid="ownerinc-chatwoot-launcher"
        href={OWNERINC_CHATWOOT_URL}
        id={OWNERINC_CHATWOOT_LAUNCHER_ID}
        isExpanded={isExpanded}
        rel="noopener noreferrer"
        target="_blank"
      >
        <OwnerincChatwootIcon aria-hidden color="white" size={20} />
        {isExpanded && (
          <>
            <StyledLabel>{OWNERINC_CHATWOOT_LABEL}</StyledLabel>
            <IconExternalLink aria-hidden color="white" size={16} />
          </>
        )}
      </StyledLauncher>

      {!isNavigationDrawerExpanded && !isMobile && (
        <AppTooltip
          anchorSelect={`#${OWNERINC_CHATWOOT_LAUNCHER_ID}`}
          content={OWNERINC_CHATWOOT_LABEL}
          delay={TooltipDelay.noDelay}
          place={TooltipPosition.Right}
          positionStrategy="fixed"
        />
      )}
    </>
  );
};
