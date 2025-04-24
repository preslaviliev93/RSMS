// components/Tooltip.jsx
'use client';

import * as Tooltip from '@radix-ui/react-tooltip';

const TooltipWrapper = ({ children, text, position = 'top' }) => {
  return (
    <Tooltip.Provider delayDuration={200}>
      <Tooltip.Root>
        <Tooltip.Trigger asChild>{children}</Tooltip.Trigger>
        <Tooltip.Portal>
          <Tooltip.Content
            side={position}
            sideOffset={6}
            className="z-50 rounded px-4 py-2 text-sm bg-gray-800 text-white shadow-lg animate-fade-in"
          >
            {text}
            <Tooltip.Arrow className="fill-gray-800" />
          </Tooltip.Content>
        </Tooltip.Portal>
      </Tooltip.Root>
    </Tooltip.Provider>
  );
};

export default TooltipWrapper;
