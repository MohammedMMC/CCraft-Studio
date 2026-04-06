import { UIElementType } from "@/models/UIElement";


export const UndoIcon = () => (
  <svg viewBox="0 0 16 16" width="14" height="14" fill="currentColor">
    <path d="M4.5 3L1 6.5l3.5 3.5v-2.5c3 0 5.5 1 7 4-.5-4-3-7-7-7V3z" />
  </svg>
);

export const RedoIcon = () => (
  <svg viewBox="0 0 16 16" width="14" height="14" fill="currentColor">
    <path d="M11.5 3l3.5 3.5-3.5 3.5v-2.5c-3 0-5.5 1-7 4 .5-4 3-7 7-7V3z" />
  </svg>
);

export const GridIcon = () => (
  <svg viewBox="0 0 16 16" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.5">
    <rect x="1" y="1" width="14" height="14" rx="1" />
    <line x1="5.5" y1="1" x2="5.5" y2="15" />
    <line x1="10.5" y1="1" x2="10.5" y2="15" />
    <line x1="1" y1="5.5" x2="15" y2="5.5" />
    <line x1="1" y1="10.5" x2="15" y2="10.5" />
  </svg>
);

export const MonitorIcon = () => (
  <svg viewBox="0 0 16 16" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-app-text-dim">
    <rect x="1" y="2" width="14" height="10" rx="1" />
    <line x1="5" y1="14" x2="11" y2="14" />
    <line x1="8" y1="12" x2="8" y2="14" />
  </svg>
);

// CraftOS-PC icons
export const CraftOSPCIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 780 780" width="16" height="16" className={className || "fill-app-text-dim"}>
    <mask id="mask0_673_58" maskUnits="userSpaceOnUse" x="0" y="0" width="780" height="780">
      <path fillRule="evenodd" clipRule="evenodd" d="M226.552 0C186.832 0 159.203 2.00205 137.741 6.08624C119.162 9.68994 105.228 14.8152 89.1314 23.4641C60.7823 38.5996 38.5996 60.7823 23.4641 89.1314C14.8152 105.228 9.68994 119.162 6.08624 137.741C2.00205 159.203 0 187.072 0 226.552V553.448C0 592.928 2.00205 620.797 6.08624 642.259C9.68994 660.838 14.8152 674.772 23.4641 690.869C38.5996 719.218 60.7823 741.4 89.1314 756.536C105.228 765.185 119.162 770.31 137.741 773.914C159.203 777.998 187.072 780 226.552 780H573.468C592.928 780 620.797 777.998 642.259 773.914C660.838 770.31 674.772 765.185 690.869 756.536C719.218 741.4 741.4 719.218 756.536 690.869C765.185 674.772 770.31 660.838 773.914 642.259C777.998 620.797 780 592.928 780 553.448V226.552C780 187.072 777.998 159.203 773.914 137.741C770.31 119.162 765.185 105.228 756.536 89.1314C741.4 60.7823 719.218 38.5996 690.869 23.4641C674.772 14.8152 660.838 9.68994 642.259 6.08624C620.797 2.00205 592.928 0 553.448 0H226.552Z" fill="white" />
      <path d="M639.856 85.688H139.343C106.172 85.688 79.2812 112.578 79.2812 145.75V534.148C79.2812 567.319 106.172 594.21 139.343 594.21H639.856C673.027 594.21 699.918 567.319 699.918 534.148V145.75C699.918 112.578 673.027 85.688 639.856 85.688Z" fill="black" />
      <path d="M177.782 143.347H132.936V188.193H177.782V143.347Z" fill="white" />
      <path d="M222.628 188.193H177.782V233.039H222.628V188.193Z" fill="white" />
      <path d="M177.782 233.84H132.936V278.686H177.782V233.84Z" fill="white" />
      <path d="M313.121 233.84H268.275V278.686H313.121V233.84Z" fill="white" />
      <path d="M357.166 233.84H312.32V278.686H357.166V233.84Z" fill="white" />
      <path d="M647.064 655.873H526.941C520.306 655.873 514.928 661.251 514.928 667.885V692.71C514.928 699.345 520.306 704.723 526.941 704.723H647.064C653.698 704.723 659.076 699.345 659.076 692.71V667.885C659.076 661.251 653.698 655.873 647.064 655.873Z" fill="black" />
    </mask>
    <g mask="url(#mask0_673_58)">
      <path d="M800.021 -20.0205H-20.0205V800.021H800.021V-20.0205Z" />
    </g>
  </svg>
);

export const CraftOSPCIcons: React.FC<{ name: 'folder' | 'remote' | 'reload' | 'monitor' | 'computer', size?: number | string, className?: string }> = ({ name, size = 16, className }) => {
  return ({
    folder: () => (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" width={size} height={size} className={className || "fill-app-text-dim"}>
        <path fillRule="evenodd" clipRule="evenodd" d="M1 6.257V2.5l.5-.5h5l.35.15.86.85h5.79l.5.5V6h1.13l.48.63-2.63 7-.48.37H8.743a5.48 5.48 0 0 0 .657-1h2.73l2.37-6H8.743a5.534 5.534 0 0 0-.72-.724l.127-.126L8.5 6H13V4H7.5l-.35-.15L6.29 3H2l.01 2.594c-.361.184-.7.407-1.01.663z" />
        <path d="M6 10.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0z" />
        <path fillRule="evenodd" clipRule="evenodd" d="M8 10.5a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0zM4.5 13a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5z" />
      </svg>
    ),
    remote: () => (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width={size} height={size} className={className || "fill-app-text-dim"}>
        <path fillRule="evenodd" clipRule="evenodd" d="M1.344 2.125h20.312l.782.781v8.599a7.825 7.825 0 0 0-1.563-.912V3.688H2.125V17.75h7.813a7.813 7.813 0 0 0 1.562 4.688H5.25v-1.563h4.688v-1.563H1.344l-.782-.78V2.905l.782-.781zM17.75 11.5a6.25 6.25 0 1 0 0 12.5 6.25 6.25 0 0 0 0-12.5zm0 10.938a4.688 4.688 0 1 1 0-9.377 4.688 4.688 0 0 1 0 9.377zm2.603-3.132L18.2 17.153 20.353 15l.647.646-1.506 1.507L21 18.659l-.647.647zM15 17.246l1.506 1.507L15 20.259l.647.647 2.153-2.153-2.153-2.153-.647.646z" />
      </svg>
    ),
    reload: () => (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640" width={size} height={size} className={className || "fill-app-text-dim"}>
        <path d="M129.9 292.5C143.2 199.5 223.3 128 320 128C373 128 421 149.5 455.8 184.2C456 184.4 456.2 184.6 456.4 184.8L464 192L416.1 192C398.4 192 384.1 206.3 384.1 224C384.1 241.7 398.4 256 416.1 256L544.1 256C561.8 256 576.1 241.7 576.1 224L576.1 96C576.1 78.3 561.8 64 544.1 64C526.4 64 512.1 78.3 512.1 96L512.1 149.4L500.8 138.7C454.5 92.6 390.5 64 320 64C191 64 84.3 159.4 66.6 283.5C64.1 301 76.2 317.2 93.7 319.7C111.2 322.2 127.4 310 129.9 292.6zM573.4 356.5C575.9 339 563.7 322.8 546.3 320.3C528.9 317.8 512.6 330 510.1 347.4C496.8 440.4 416.7 511.9 320 511.9C267 511.9 219 490.4 184.2 455.7C184 455.5 183.8 455.3 183.6 455.1L176 447.9L223.9 447.9C241.6 447.9 255.9 433.6 255.9 415.9C255.9 398.2 241.6 383.9 223.9 383.9L96 384C87.5 384 79.3 387.4 73.3 393.5C67.3 399.6 63.9 407.7 64 416.3L65 543.3C65.1 561 79.6 575.2 97.3 575C115 574.8 129.2 560.4 129 542.7L128.6 491.2L139.3 501.3C185.6 547.4 249.5 576 320 576C449 576 555.7 480.6 573.4 356.5z" />
      </svg>
    ),
    monitor: () => (
      <svg className={className} style={{ shapeRendering: "crispEdges", imageRendering: "pixelated" }} width={size} height={size} viewBox="0 0 128 128" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M8 0H0V8H8V0Z" fill="#383838" />
        <path d="M16 0H8V8H16V0Z" fill="#353535" />
        <path d="M24 0H16V8H24V0Z" fill="#353535" />
        <path d="M32 0H24V8H32V0Z" fill="#333333" />
        <path d="M40 0H32V8H40V0Z" fill="#303030" />
        <path d="M48 0H40V8H48V0Z" fill="#2F2F2F" />
        <path d="M56 0H48V8H56V0Z" fill="#2D2D2D" />
        <path d="M64 0H56V8H64V0Z" fill="#2D2D2D" />
        <path d="M72 0H64V8H72V0Z" fill="#242424" />
        <path d="M80 0H72V8H80V0Z" fill="#3B3B3B" />
        <path d="M88 0H80V8H88V0Z" fill="#383838" />
        <path d="M96 0H88V8H96V0Z" fill="#353535" />
        <path d="M104 0H96V8H104V0Z" fill="#2D2D2D" />
        <path d="M112 0H104V8H112V0Z" fill="#272727" />
        <path d="M120 0H112V8H120V0Z" fill="#363636" />
        <path d="M128 0H120V8H128V0Z" fill="#323232" />
        <path d="M8 8H0V16H8V8Z" fill="#383838" />
        <path d="M16 8H8V16H16V8Z" fill="#DCD080" />
        <path d="M24 8H16V16H24V8Z" fill="#DBD17D" />
        <path d="M32 8H24V16H32V8Z" fill="#DDD27B" />
        <path d="M40 8H32V16H40V8Z" fill="#DCD678" />
        <path d="M48 8H40V16H48V8Z" fill="#DBD777" />
        <path d="M56 8H48V16H56V8Z" fill="#DCD876" />
        <path d="M64 8H56V16H64V8Z" fill="#DCD878" />
        <path d="M72 8H64V16H72V8Z" fill="#DCD678" />
        <path d="M80 8H72V16H80V8Z" fill="#DCD678" />
        <path d="M88 8H80V16H88V8Z" fill="#DCD678" />
        <path d="M96 8H88V16H96V8Z" fill="#DCD676" />
        <path d="M104 8H96V16H104V8Z" fill="#DCD676" />
        <path d="M112 8H104V16H112V8Z" fill="#DCD374" />
        <path d="M120 8H112V16H120V8Z" fill="#DCD370" />
        <path d="M128 8H120V16H128V8Z" fill="#323232" />
        <path d="M8 16H0V24H8V16Z" fill="#292929" />
        <path d="M16 16H8V24H16V16Z" fill="#DCD87C" />
        <path d="M24 16H16V24H24V16Z" fill="#111111" />
        <path d="M32 16H24V24H32V16Z" fill="#111111" />
        <path d="M40 16H32V24H40V16Z" fill="#111111" />
        <path d="M48 16H40V24H48V16Z" fill="#111111" />
        <path d="M56 16H48V24H56V16Z" fill="#111111" />
        <path d="M64 16H56V24H64V16Z" fill="#111111" />
        <path d="M72 16H64V24H72V16Z" fill="#111111" />
        <path d="M80 16H72V24H80V16Z" fill="#111111" />
        <path d="M88 16H80V24H88V16Z" fill="#111111" />
        <path d="M96 16H88V24H96V16Z" fill="#111111" />
        <path d="M104 16H96V24H104V16Z" fill="#111111" />
        <path d="M112 16H104V24H112V16Z" fill="#111111" />
        <path d="M120 16H112V24H120V16Z" fill="#DAD668" />
        <path d="M128 16H120V24H128V16Z" fill="#303030" />
        <path d="M8 24H0V32H8V24Z" fill="#2D2D2D" />
        <path d="M16 24H8V32H16V24Z" fill="#DCDA76" />
        <path d="M24 24H16V32H24V24Z" fill="#111111" />
        <path d="M32 24H24V32H32V24Z" fill="#111111" />
        <path d="M40 24H32V32H40V24Z" fill="#111111" />
        <path d="M48 24H40V32H48V24Z" fill="#111111" />
        <path d="M56 24H48V32H56V24Z" fill="#111111" />
        <path d="M64 24H56V32H64V24Z" fill="#111111" />
        <path d="M72 24H64V32H72V24Z" fill="#111111" />
        <path d="M80 24H72V32H80V24Z" fill="#111111" />
        <path d="M88 24H80V32H88V24Z" fill="#111111" />
        <path d="M96 24H88V32H96V24Z" fill="#111111" />
        <path d="M104 24H96V32H104V24Z" fill="#111111" />
        <path d="M112 24H104V32H112V24Z" fill="#111111" />
        <path d="M120 24H112V32H120V24Z" fill="#DCD86C" />
        <path d="M128 24H120V32H128V24Z" fill="#292929" />
        <path d="M8 32H0V40H8V32Z" fill="#383838" />
        <path d="M16 32H8V40H16V32Z" fill="#DCDB76" />
        <path d="M24 32H16V40H24V32Z" fill="#111111" />
        <path d="M32 32H24V40H32V32Z" fill="#111111" />
        <path d="M40 32H32V40H40V32Z" fill="#111111" />
        <path d="M48 32H40V40H48V32Z" fill="#111111" />
        <path d="M56 32H48V40H56V32Z" fill="#111111" />
        <path d="M64 32H56V40H64V32Z" fill="#111111" />
        <path d="M72 32H64V40H72V32Z" fill="#111111" />
        <path d="M80 32H72V40H80V32Z" fill="#111111" />
        <path d="M88 32H80V40H88V32Z" fill="#111111" />
        <path d="M96 32H88V40H96V32Z" fill="#111111" />
        <path d="M104 32H96V40H104V32Z" fill="#111111" />
        <path d="M112 32H104V40H112V32Z" fill="#111111" />
        <path d="M120 32H112V40H120V32Z" fill="#DBD46B" />
        <path d="M128 32H120V40H128V32Z" fill="#242424" />
        <path d="M8 40H0V48H8V40Z" fill="#2B2B2B" />
        <path d="M16 40H8V48H16V40Z" fill="#D9DA78" />
        <path d="M24 40H16V48H24V40Z" fill="#111111" />
        <path d="M32 40H24V48H32V40Z" fill="#111111" />
        <path d="M40 40H32V48H40V40Z" fill="#111111" />
        <path d="M48 40H40V48H48V40Z" fill="#111111" />
        <path d="M56 40H48V48H56V40Z" fill="#111111" />
        <path d="M64 40H56V48H64V40Z" fill="#111111" />
        <path d="M72 40H64V48H72V40Z" fill="#111111" />
        <path d="M80 40H72V48H80V40Z" fill="#111111" />
        <path d="M88 40H80V48H88V40Z" fill="#111111" />
        <path d="M96 40H88V48H96V40Z" fill="#111111" />
        <path d="M104 40H96V48H104V40Z" fill="#111111" />
        <path d="M112 40H104V48H112V40Z" fill="#111111" />
        <path d="M120 40H112V48H120V40Z" fill="#DAD970" />
        <path d="M128 40H120V48H128V40Z" fill="#242424" />
        <path d="M8 48H0V56H8V48Z" fill="#323232" />
        <path d="M16 48H8V56H16V48Z" fill="#D8D979" />
        <path d="M24 48H16V56H24V48Z" fill="#111111" />
        <path d="M32 48H24V56H32V48Z" fill="#111111" />
        <path d="M40 48H32V56H40V48Z" fill="#111111" />
        <path d="M48 48H40V56H48V48Z" fill="#111111" />
        <path d="M56 48H48V56H56V48Z" fill="#111111" />
        <path d="M64 48H56V56H64V48Z" fill="#111111" />
        <path d="M72 48H64V56H72V48Z" fill="#111111" />
        <path d="M80 48H72V56H80V48Z" fill="#111111" />
        <path d="M88 48H80V56H88V48Z" fill="#111111" />
        <path d="M96 48H88V56H96V48Z" fill="#111111" />
        <path d="M104 48H96V56H104V48Z" fill="#111111" />
        <path d="M112 48H104V56H112V48Z" fill="#111111" />
        <path d="M120 48H112V56H120V48Z" fill="#DBD46B" />
        <path d="M128 48H120V56H128V48Z" fill="#232323" />
        <path d="M8 56H0V64H8V56Z" fill="#2F2F2F" />
        <path d="M16 56H8V64H16V56Z" fill="#DADB7F" />
        <path d="M24 56H16V64H24V56Z" fill="#111111" />
        <path d="M32 56H24V64H32V56Z" fill="#111111" />
        <path d="M40 56H32V64H40V56Z" fill="#111111" />
        <path d="M48 56H40V64H48V56Z" fill="#111111" />
        <path d="M56 56H48V64H56V56Z" fill="#111111" />
        <path d="M64 56H56V64H64V56Z" fill="#111111" />
        <path d="M72 56H64V64H72V56Z" fill="#111111" />
        <path d="M80 56H72V64H80V56Z" fill="#111111" />
        <path d="M88 56H80V64H88V56Z" fill="#111111" />
        <path d="M96 56H88V64H96V56Z" fill="#111111" />
        <path d="M104 56H96V64H104V56Z" fill="#111111" />
        <path d="M112 56H104V64H112V56Z" fill="#111111" />
        <path d="M120 56H112V64H120V56Z" fill="#DBD467" />
        <path d="M128 56H120V64H128V56Z" fill="#3A3A3A" />
        <path d="M8 64H0V72H8V64Z" fill="#2F2F2F" />
        <path d="M16 64H8V72H16V64Z" fill="#DCD97E" />
        <path d="M24 64H16V72H24V64Z" fill="#111111" />
        <path d="M32 64H24V72H32V64Z" fill="#111111" />
        <path d="M40 64H32V72H40V64Z" fill="#111111" />
        <path d="M48 64H40V72H48V64Z" fill="#111111" />
        <path d="M56 64H48V72H56V64Z" fill="#111111" />
        <path d="M64 64H56V72H64V64Z" fill="#111111" />
        <path d="M72 64H64V72H72V64Z" fill="#111111" />
        <path d="M80 64H72V72H80V64Z" fill="#111111" />
        <path d="M88 64H80V72H88V64Z" fill="#111111" />
        <path d="M96 64H88V72H96V64Z" fill="#111111" />
        <path d="M104 64H96V72H104V64Z" fill="#111111" />
        <path d="M112 64H104V72H112V64Z" fill="#111111" />
        <path d="M120 64H112V72H120V64Z" fill="#D9D065" />
        <path d="M128 64H120V72H128V64Z" fill="#3B3B3B" />
        <path d="M8 72H0V80H8V72Z" fill="#4B4B4B" />
        <path d="M16 72H8V80H16V72Z" fill="#EDEA93" />
        <path d="M24 72H16V80H24V72Z" fill="#111111" />
        <path d="M32 72H24V80H32V72Z" fill="#111111" />
        <path d="M40 72H32V80H40V72Z" fill="#111111" />
        <path d="M48 72H40V80H48V72Z" fill="#111111" />
        <path d="M56 72H48V80H56V72Z" fill="#111111" />
        <path d="M64 72H56V80H64V72Z" fill="#111111" />
        <path d="M72 72H64V80H72V72Z" fill="#111111" />
        <path d="M80 72H72V80H80V72Z" fill="#111111" />
        <path d="M88 72H80V80H88V72Z" fill="#111111" />
        <path d="M96 72H88V80H96V72Z" fill="#111111" />
        <path d="M104 72H96V80H104V72Z" fill="#111111" />
        <path d="M112 72H104V80H112V72Z" fill="#111111" />
        <path d="M120 72H112V80H120V72Z" fill="#EEE884" />
        <path d="M128 72H120V80H128V72Z" fill="#3F3F3F" />
        <path d="M8 80H0V88H8V80Z" fill="#4B4B4B" />
        <path d="M16 80H8V88H16V80Z" fill="#EDEC99" />
        <path d="M24 80H16V88H24V80Z" fill="#111111" />
        <path d="M32 80H24V88H32V80Z" fill="#111111" />
        <path d="M40 80H32V88H40V80Z" fill="#111111" />
        <path d="M48 80H40V88H48V80Z" fill="#111111" />
        <path d="M56 80H48V88H56V80Z" fill="#111111" />
        <path d="M64 80H56V88H64V80Z" fill="#111111" />
        <path d="M72 80H64V88H72V80Z" fill="#111111" />
        <path d="M80 80H72V88H80V80Z" fill="#111111" />
        <path d="M88 80H80V88H88V80Z" fill="#111111" />
        <path d="M96 80H88V88H96V80Z" fill="#111111" />
        <path d="M104 80H96V88H104V80Z" fill="#111111" />
        <path d="M112 80H104V88H112V80Z" fill="#111111" />
        <path d="M120 80H112V88H120V80Z" fill="#EDE483" />
        <path d="M128 80H120V88H128V80Z" fill="#303030" />
        <path d="M8 88H0V96H8V88Z" fill="#4B4B4B" />
        <path d="M16 88H8V96H16V88Z" fill="#EDEC9D" />
        <path d="M24 88H16V96H24V88Z" fill="#111111" />
        <path d="M32 88H24V96H32V88Z" fill="#111111" />
        <path d="M40 88H32V96H40V88Z" fill="#111111" />
        <path d="M48 88H40V96H48V88Z" fill="#111111" />
        <path d="M56 88H48V96H56V88Z" fill="#111111" />
        <path d="M64 88H56V96H64V88Z" fill="#111111" />
        <path d="M72 88H64V96H72V88Z" fill="#111111" />
        <path d="M80 88H72V96H80V88Z" fill="#111111" />
        <path d="M88 88H80V96H88V88Z" fill="#111111" />
        <path d="M96 88H88V96H96V88Z" fill="#111111" />
        <path d="M104 88H96V96H104V88Z" fill="#111111" />
        <path d="M112 88H104V96H112V88Z" fill="#111111" />
        <path d="M120 88H112V96H120V88Z" fill="#ECDB7C" />
        <path d="M128 88H120V96H128V88Z" fill="#323232" />
        <path d="M8 96H0V104H8V96Z" fill="#4B4B4B" />
        <path d="M16 96H8V104H16V96Z" fill="#EBEC98" />
        <path d="M24 96H16V104H24V96Z" fill="#111111" />
        <path d="M32 96H24V104H32V96Z" fill="#111111" />
        <path d="M40 96H32V104H40V96Z" fill="#111111" />
        <path d="M48 96H40V104H48V96Z" fill="#111111" />
        <path d="M56 96H48V104H56V96Z" fill="#111111" />
        <path d="M64 96H56V104H64V96Z" fill="#111111" />
        <path d="M72 96H64V104H72V96Z" fill="#111111" />
        <path d="M80 96H72V104H80V96Z" fill="#111111" />
        <path d="M88 96H80V104H88V96Z" fill="#111111" />
        <path d="M96 96H88V104H96V96Z" fill="#111111" />
        <path d="M104 96H96V104H104V96Z" fill="#111111" />
        <path d="M112 96H104V104H112V96Z" fill="#111111" />
        <path d="M120 96H112V104H120V96Z" fill="#ECD87A" />
        <path d="M128 96H120V104H128V96Z" fill="#2D2D2D" />
        <path d="M8 104H0V112H8V104Z" fill="#4A4A4A" />
        <path d="M16 104H8V112H16V104Z" fill="#ECED91" />
        <path d="M24 104H16V112H24V104Z" fill="#111111" />
        <path d="M32 104H24V112H32V104Z" fill="#111111" />
        <path d="M40 104H32V112H40V104Z" fill="#111111" />
        <path d="M48 104H40V112H48V104Z" fill="#111111" />
        <path d="M56 104H48V112H56V104Z" fill="#111111" />
        <path d="M64 104H56V112H64V104Z" fill="#111111" />
        <path d="M72 104H64V112H72V104Z" fill="#111111" />
        <path d="M80 104H72V112H80V104Z" fill="#111111" />
        <path d="M88 104H80V112H88V104Z" fill="#111111" />
        <path d="M96 104H88V112H96V104Z" fill="#111111" />
        <path d="M104 104H96V112H104V104Z" fill="#111111" />
        <path d="M112 104H104V112H112V104Z" fill="#111111" />
        <path d="M120 104H112V112H120V104Z" fill="#EFDA79" />
        <path d="M128 104H120V112H128V104Z" fill="#323232" />
        <path d="M8 112H0V120H8V112Z" fill="#4D4D4D" />
        <path d="M16 112H8V120H16V112Z" fill="#EDEB87" />
        <path d="M24 112H16V120H24V112Z" fill="#ECEB86" />
        <path d="M32 112H24V120H32V112Z" fill="#EDE985" />
        <path d="M40 112H32V120H40V112Z" fill="#EDE987" />
        <path d="M48 112H40V120H48V112Z" fill="#EEEA86" />
        <path d="M56 112H48V120H56V112Z" fill="#EDE787" />
        <path d="M64 112H56V120H64V112Z" fill="#EDE787" />
        <path d="M72 112H64V120H72V112Z" fill="#EDE787" />
        <path d="M80 112H72V120H80V112Z" fill="#EEE586" />
        <path d="M88 112H80V120H88V112Z" fill="#ECDB7C" />
        <path d="M96 112H88V120H96V112Z" fill="#EFDA79" />
        <path d="M104 112H96V120H104V112Z" fill="#EDD575" />
        <path d="M112 112H104V120H112V112Z" fill="#ECD474" />
        <path d="M120 112H112V120H120V112Z" fill="#EDD273" />
        <path d="M128 112H120V120H128V112Z" fill="#2D2D2D" />
        <path d="M8 120H0V128H8V120Z" fill="#3F3F3F" />
        <path d="M16 120H8V128H16V120Z" fill="#323232" />
        <path d="M24 120H16V128H24V120Z" fill="#323232" />
        <path d="M32 120H24V128H32V120Z" fill="#303030" />
        <path d="M40 120H32V128H40V120Z" fill="#303030" />
        <path d="M48 120H40V128H48V120Z" fill="#303030" />
        <path d="M56 120H48V128H56V120Z" fill="#303030" />
        <path d="M64 120H56V128H64V120Z" fill="#303030" />
        <path d="M72 120H64V128H72V120Z" fill="#303030" />
        <path d="M80 120H72V128H80V120Z" fill="#2D2D2D" />
        <path d="M88 120H80V128H88V120Z" fill="#303030" />
        <path d="M96 120H88V128H96V120Z" fill="#303030" />
        <path d="M104 120H96V128H104V120Z" fill="#303030" />
        <path d="M112 120H104V128H112V120Z" fill="#303030" />
        <path d="M120 120H112V128H120V120Z" fill="#323232" />
        <path d="M128 120H120V128H128V120Z" fill="#323232" />
      </svg>
    ),
    computer: () => (
      <svg className={className} style={{ shapeRendering: "crispEdges", imageRendering: "pixelated" }} width={size} height={size} viewBox="0 0 128 128" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M0 0H8V16H0V0Z" fill="#353535" />
        <path d="M8 0H24V8H8V0Z" fill="#323232" />
        <path d="M24 0H32V8H24V0Z" fill="#303030" />
        <path d="M32 0H40V8H32V0Z" fill="#2C2C2C" />
        <path d="M40 0H48V8H40V0Z" fill="#2B2B2B" />
        <path d="M48 0H64V8H48V0Z" fill="#292929" />
        <path d="M64 0H72V8H64V0Z" fill="#1F1F1F" />
        <path d="M72 0H80V8H72V0Z" fill="#383838" />
        <path d="M80 0H88V8H80V0Z" fill="#353535" />
        <path d="M88 0H96V8H88V0Z" fill="#323232" />
        <path d="M96 0H104V8H96V0Z" fill="#292929" />
        <path d="M104 0H112V8H104V0Z" fill="#222222" />
        <path d="M112 0H120V8H112V0Z" fill="#333333" />
        <path d="M120 0H128V16H120V0Z" fill="#2E2E2E" />
        <path d="M8 8H16V16H8V8Z" fill="#CFC790" />
        <path d="M16 8H24V16H16V8Z" fill="#CEC68D" />
        <path d="M24 8H32V16H24V8Z" fill="#CFC88C" />
        <path d="M32 8H40V16H32V8Z" fill="#CFCB8B" />
        <path d="M40 8H64V16H40V8Z" fill="#D0CD8B" />
        <path d="M64 8H72V16H64V8Z" fill="#CFCB8B" />
        <path d="M72 8H80V16H72V8Z" fill="#CFCA8B" />
        <path d="M80 8H88V16H80V8Z" fill="#D0CC8B" />
        <path d="M88 8H104V16H88V8Z" fill="#D0CC8A" />
        <path d="M104 8H112V16H104V8Z" fill="#D0CA88" />
        <path d="M112 8H120V16H112V8Z" fill="#D0CC87" />
        <path d="M0 16H8V24H0V16Z" fill="#242424" />
        <path d="M8 16H16V24H8V16Z" fill="#D0CE8F" />
        <path d="M16 16H112V96H16V16Z" fill="#080808" />
        <path d="M112 16H120V24H112V16Z" fill="#CECB7F" />
        <path d="M120 16H128V24H120V16Z" fill="#2C2C2C" />
        <path d="M0 24H8V32H0V24Z" fill="#292929" />
        <path d="M8 24H16V40H8V24Z" fill="#D1D08B" />
        <path d="M24 24H32V32H24V24Z" fill="white" />
        <path d="M112 24H120V32H112V24Z" fill="#D0CD83" />
        <path d="M120 24H128V32H120V24Z" fill="#242424" />
        <path d="M0 32H8V40H0V32Z" fill="#353535" />
        <path d="M32 32H40V40H32V32Z" fill="white" />
        <path d="M112 32H120V40H112V32Z" fill="#CFCB82" />
        <path d="M120 32H128V48H120V32Z" fill="#1F1F1F" />
        <path d="M0 40H8V48H0V40Z" fill="#272727" />
        <path d="M8 40H16V48H8V40Z" fill="#D0CF8B" />
        <path d="M24 40H32V48H24V40Z" fill="white" />
        <path d="M48 40H64V48H48V40Z" fill="white" />
        <path d="M112 40H120V48H112V40Z" fill="#CFCE85" />
        <path d="M0 48H8V56H0V48Z" fill="#2E2E2E" />
        <path d="M8 48H16V56H8V48Z" fill="#CFCE8C" />
        <path d="M112 48H120V56H112V48Z" fill="#CFCB82" />
        <path d="M120 48H128V56H120V48Z" fill="#1E1E1E" />
        <path d="M0 56H8V72H0V56Z" fill="#2B2B2B" />
        <path d="M8 56H16V64H8V56Z" fill="#CFCE90" />
        <path d="M112 56H120V64H112V56Z" fill="#CECA80" />
        <path d="M120 56H128V64H120V56Z" fill="#373737" />
        <path d="M8 64H16V72H8V64Z" fill="#D1D090" />
        <path d="M112 64H120V72H112V64Z" fill="#CBC57C" />
        <path d="M120 64H128V72H120V64Z" fill="#383838" />
        <path d="M0 72H8V104H0V72Z" fill="#4A4A4A" />
        <path d="M8 72H16V80H8V72Z" fill="#E2DFA5" />
        <path d="M112 72H120V80H112V72Z" fill="#E1DD9A" />
        <path d="M120 72H128V80H120V72Z" fill="#3D3D3D" />
        <path d="M8 80H16V88H8V80Z" fill="#E2DFA8" />
        <path d="M112 80H120V88H112V80Z" fill="#E1DB97" />
        <path d="M120 80H128V88H120V80Z" fill="#2C2C2C" />
        <path d="M8 88H16V96H8V88Z" fill="#E3E1AA" />
        <path d="M112 88H120V96H112V88Z" fill="#DED291" />
        <path d="M120 88H128V96H120V88Z" fill="#2E2E2E" />
        <path d="M8 96H16V104H8V96Z" fill="#E2E1A8" />
        <path d="M16 96H32V104H16V96Z" fill="#E2E0A8" />
        <path d="M32 96H48V104H32V96Z" fill="#E2E1A8" />
        <path d="M48 96H56V104H48V96Z" fill="#E2E2A7" />
        <path d="M56 96H64V104H56V96Z" fill="#E2DFA5" />
        <path d="M64 96H72V104H64V96Z" fill="#E1DEA4" />
        <path d="M72 96H80V104H72V96Z" fill="#E1DEA2" />
        <path d="M80 96H88V104H80V96Z" fill="#E2DC9C" />
        <path d="M88 96H96V104H88V96Z" fill="#E0D997" />
        <path d="M96 96H104V104H96V96Z" fill="#DCD191" />
        <path d="M104 96H112V104H104V96Z" fill="#DCD18F" />
        <path d="M112 96H120V104H112V96Z" fill="#DCCF8E" />
        <path d="M120 96H128V104H120V96Z" fill="#292929" />
        <path d="M0 104H8V112H0V104Z" fill="#494949" />
        <path d="M8 104H16V112H8V104Z" fill="#E2E1A3" />
        <path d="M16 104H32V112H16V104Z" fill="#E0E0A0" />
        <path d="M32 104H40V112H32V104Z" fill="#E1E1A3" />
        <path d="M40 104H56V112H40V104Z" fill="#E2E1A3" />
        <path d="M56 104H64V112H56V104Z" fill="#E3E1A2" />
        <path d="M64 104H72V112H64V104Z" fill="#E1DE9F" />
        <path d="M72 104H80V112H72V104Z" fill="#E0DD9E" />
        <path d="M80 104H88V112H80V104Z" fill="#DFD896" />
        <path d="M88 104H96V112H88V104Z" fill="#DFD391" />
        <path d="M96 104H112V112H96V104Z" fill="#222222" />
        <path d="M112 104H120V112H112V104Z" fill="#DED18F" />
        <path d="M120 104H128V112H120V104Z" fill="#2E2E2E" />
        <path d="M0 112H8V120H0V112Z" fill="#4C4C4C" />
        <path d="M8 112H16V120H8V112Z" fill="#E3E19D" />
        <path d="M16 112H24V120H16V112Z" fill="#E2E09C" />
        <path d="M24 112H32V120H24V112Z" fill="#E1DE9A" />
        <path d="M32 112H40V120H32V112Z" fill="#E1DE9B" />
        <path d="M40 112H48V120H40V112Z" fill="#E2DF9B" />
        <path d="M48 112H64V120H48V112Z" fill="#E2DD9C" />
        <path d="M64 112H72V120H64V112Z" fill="#E2DC9C" />
        <path d="M72 112H80V120H72V112Z" fill="#E1DB99" />
        <path d="M80 112H88V120H80V112Z" fill="#DFD492" />
        <path d="M88 112H96V120H88V112Z" fill="#DED18F" />
        <path d="M96 112H104V120H96V112Z" fill="#DCCC8B" />
        <path d="M104 112H112V120H104V112Z" fill="#DBCB8A" />
        <path d="M112 112H120V120H112V112Z" fill="#DBC989" />
        <path d="M120 112H128V120H120V112Z" fill="#292929" />
        <path d="M0 120H8V128H0V120Z" fill="#3D3D3D" />
        <path d="M8 120H24V128H8V120Z" fill="#2E2E2E" />
        <path d="M24 120H72V128H24V120Z" fill="#2C2C2C" />
        <path d="M72 120H80V128H72V120Z" fill="#292929" />
        <path d="M80 120H112V128H80V120Z" fill="#2C2C2C" />
        <path d="M112 120H128V128H112V120Z" fill="#2E2E2E" />
      </svg>
    ),
  })[name]();
}

// > ICONS FOR ELEMENTS <
// <!--!Font Awesome Free v7.2.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2026 Fonticons, Inc.-->

export const ElementIcons: React.FC<{ name: UIElementType }> = ({ name }) => {
  return ({
    label: () => (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640" width="16" height="16" className="text-app-text-dim fill-app-text-dim">
        <path d="M349.5 115.7C344.6 103.8 332.9 96 320 96C307.1 96 295.4 103.8 290.5 115.7C197.2 339.7 143.8 467.7 130.5 499.7C123.7 516 131.4 534.7 147.7 541.5C164 548.3 182.7 540.6 189.5 524.3L221.3 448L418.6 448L450.4 524.3C457.2 540.6 475.9 548.3 492.2 541.5C508.5 534.7 516.2 516 509.4 499.7C496.1 467.7 442.7 339.7 349.4 115.7zM392 384L248 384L320 211.2L392 384z" />
      </svg>
    ),
    button: () => (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 384" width="16" height="16" className="text-app-text-dim fill-app-text-dim">
        <path d="M64 48C55.2 48 48 55.2 48 64V320C48 328.8 55.2 336 64 336H448C456.8 336 464 328.8 464 320V64C464 55.2 456.8 48 448 48H64ZM0 64C0 28.7 28.7 0 64 0H448C483.3 0 512 28.7 512 64V320C512 355.3 483.3 384 448 384H64C28.7 384 0 355.3 0 320V64ZM256.443 168.709C269.736 168.906 267.838 168.1 280.423 168.287L342.783 169.21C356.075 169.407 366.663 180.313 366.397 193.533C366.13 206.753 355.294 217.413 342.073 217.146L279.713 216.223C258.785 215.913 268.234 216.358 255.013 216.091C241.793 215.825 249.17 215.771 231.777 215.513L169.417 214.59C156.125 214.393 145.537 203.487 145.803 190.267C146.07 177.047 156.906 166.387 170.127 166.654L232.487 167.577C247.9 167.805 243.223 168.443 256.443 168.709Z" />
      </svg>
    ),
    container: () => (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640" width="16" height="16" className="text-app-text-dim fill-app-text-dim">
        <path d="M64 183.4C44.9 172.4 32 151.7 32 128C32 92.7 60.7 64 96 64C119.7 64 140.4 76.9 151.4 96L488.5 96C499.6 76.9 520.2 64 543.9 64C579.2 64 607.9 92.7 607.9 128C607.9 151.7 595 172.4 575.9 183.4L575.9 456.5C595 467.6 607.9 488.2 607.9 511.9C607.9 547.2 579.2 575.9 543.9 575.9C520.2 575.9 499.5 563 488.5 543.9L151.4 543.9C140.3 563 119.7 575.9 96 575.9C60.7 575.9 32 547.2 32 511.9C32 488.2 44.9 467.5 64 456.5L64 183.4zM512 183.4C502.3 177.8 494.2 169.7 488.6 160L151.4 160C145.8 169.7 137.7 177.8 128 183.4L128 456.5C137.7 462.1 145.8 470.2 151.4 479.9L488.5 479.9C494.1 470.2 502.2 462.1 511.9 456.5L511.9 183.4zM176 240C176 222.3 190.3 208 208 208L320 208C337.7 208 352 222.3 352 240L352 304C352 321.7 337.7 336 320 336L208 336C190.3 336 176 321.7 176 304L176 240zM288 384L320 384C364.2 384 400 348.2 400 304L432 304C449.7 304 464 318.3 464 336L464 400C464 417.7 449.7 432 432 432L320 432C302.3 432 288 417.7 288 400L288 384z" />
      </svg>
    ),
    panel: () => (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640" width="16" height="16" className="text-app-text-dim fill-app-text-dim">
        <path d="M64 183.4C44.9 172.4 32 151.7 32 128C32 92.7 60.7 64 96 64C119.7 64 140.4 76.9 151.4 96L488.5 96C499.6 76.9 520.2 64 543.9 64C579.2 64 607.9 92.7 607.9 128C607.9 151.7 595 172.4 575.9 183.4L575.9 456.5C595 467.6 607.9 488.2 607.9 511.9C607.9 547.2 579.2 575.9 543.9 575.9C520.2 575.9 499.5 563 488.5 543.9L151.4 543.9C140.3 563 119.7 575.9 96 575.9C60.7 575.9 32 547.2 32 511.9C32 488.2 44.9 467.5 64 456.5L64 183.4zM512 183.4C502.3 177.8 494.2 169.7 488.6 160L151.4 160C145.8 169.7 137.7 177.8 128 183.4L128 456.5C137.7 462.1 145.8 470.2 151.4 479.9L488.5 479.9C494.1 470.2 502.2 462.1 511.9 456.5L511.9 183.4zM176 240C176 222.3 190.3 208 208 208L320 208C337.7 208 352 222.3 352 240L352 304C352 321.7 337.7 336 320 336L208 336C190.3 336 176 321.7 176 304L176 240zM288 384L320 384C364.2 384 400 348.2 400 304L432 304C449.7 304 464 318.3 464 336L464 400C464 417.7 449.7 432 432 432L320 432C302.3 432 288 417.7 288 400L288 384z" />
      </svg>
    ),
    progressbar: () => (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640" width="16" height="16" className="text-app-text-dim fill-app-text-dim">
        <path d="M384 224L480 224L480 160L384 160L384 224zM96 224L96 144C96 117.5 117.5 96 144 96L496 96C522.5 96 544 117.5 544 144L544 240C544 266.5 522.5 288 496 288L144 288C117.5 288 96 266.5 96 240L96 224zM256 480L480 480L480 416L256 416L256 480zM96 480L96 400C96 373.5 117.5 352 144 352L496 352C522.5 352 544 373.5 544 400L544 496C544 522.5 522.5 544 496 544L144 544C117.5 544 96 522.5 96 496L96 480z" />
      </svg>
    ),
    slider: () => (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640" width="16" height="16" className="text-app-text-dim fill-app-text-dim">
        <path d="M96 128C78.3 128 64 142.3 64 160C64 177.7 78.3 192 96 192L182.7 192C195 220.3 223.2 240 256 240C288.8 240 317 220.3 329.3 192L544 192C561.7 192 576 177.7 576 160C576 142.3 561.7 128 544 128L329.3 128C317 99.7 288.8 80 256 80C223.2 80 195 99.7 182.7 128L96 128zM96 288C78.3 288 64 302.3 64 320C64 337.7 78.3 352 96 352L342.7 352C355 380.3 383.2 400 416 400C448.8 400 477 380.3 489.3 352L544 352C561.7 352 576 337.7 576 320C576 302.3 561.7 288 544 288L489.3 288C477 259.7 448.8 240 416 240C383.2 240 355 259.7 342.7 288L96 288zM96 448C78.3 448 64 462.3 64 480C64 497.7 78.3 512 96 512L150.7 512C163 540.3 191.2 560 224 560C256.8 560 285 540.3 297.3 512L544 512C561.7 512 576 497.7 576 480C576 462.3 561.7 448 544 448L297.3 448C285 419.7 256.8 400 224 400C191.2 400 163 419.7 150.7 448L96 448z" />
      </svg>
    ),
    checkbox: () => (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640" width="16" height="16" className="text-app-text-dim fill-app-text-dim">
        <path d="M480 96C515.3 96 544 124.7 544 160L544 480C544 515.3 515.3 544 480 544L160 544C124.7 544 96 515.3 96 480L96 160C96 124.7 124.7 96 160 96L480 96zM160 144C151.2 144 144 151.2 144 160L144 480C144 488.8 151.2 496 160 496L480 496C488.8 496 496 488.8 496 480L496 160C496 151.2 488.8 144 480 144L160 144zM390.7 233.9C398.5 223.2 413.5 220.8 424.2 228.6C434.9 236.4 437.3 251.4 429.5 262.1L307.4 430.1C303.3 435.8 296.9 439.4 289.9 439.9C282.9 440.4 276 437.9 271.1 433L215.2 377.1C205.8 367.7 205.8 352.5 215.2 343.2C224.6 333.9 239.8 333.8 249.1 343.2L285.1 379.2L390.7 234z" />
      </svg>
    ),
    input: () => (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 634 383" width="16" height="16" className="text-app-text-dim fill-app-text-dim">
        <path d="M66.5735 47.4999C55.106 47.4999 45.7235 54.6999 45.7235 63.4999V319.5C45.7235 328.3 55.106 335.5 66.5735 335.5H566.973C578.441 335.5 587.823 328.3 587.823 319.5C587.823 219.526 587.823 163.474 587.823 63.4999C587.823 54.6999 578.441 47.4999 566.973 47.4999H66.5735ZM0.224609 63.4999C0.224609 28.1999 20.5732 -0.5 66.5735 -0.5H566.973C612.974 -0.5 634.26 28.1999 634.26 63.4999V319.5C634.26 354.8 612.974 383.5 566.973 383.5H66.5735C20.5732 383.5 0.224609 354.8 0.224609 319.5V63.4999ZM352.075 245.563C363.725 245.76 362.062 244.954 373.091 245.14L427.744 246.063C439.393 246.26 448.672 257.166 448.439 270.387C448.205 283.607 438.708 294.266 427.122 294L372.469 293.077C354.128 292.767 362.408 293.211 350.822 292.945C339.236 292.678 345.701 292.624 330.457 292.367L275.805 291.444C264.156 291.247 254.877 280.341 255.11 267.12C255.344 253.9 264.841 243.241 276.427 243.507L331.08 244.43C344.588 244.659 340.489 245.297 352.075 245.563Z" />
        <path fillRule="evenodd" clipRule="evenodd" d="M129.47 246H176.291V270C176.291 283.3 186.728 294 199.702 294C212.675 294 223.112 283.3 223.112 270V166C223.112 130.7 195.117 102 160.684 102H145.077C110.644 102 82.6492 130.7 82.6492 166V270C82.6492 283.3 93.0864 294 106.06 294C119.033 294 129.47 283.3 129.47 270V246ZM145.077 150C136.493 150 129.47 157.2 129.47 166V198H176.291V166C176.291 157.2 169.268 150 160.684 150H145.077Z" />
      </svg>
    ),
  })[name]();
};