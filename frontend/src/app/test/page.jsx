// app/test/page.jsx
'use client';

import Tooltip from '../components/Tooltip';

export default function TestPage() {
  return (
    <div className="p-10">
      <Tooltip text="I'm a tooltip!" position="top">
        <button className="px-4 py-2 bg-blue-600 text-white rounded">Hover me</button>
      </Tooltip>
    </div>
  );
}
