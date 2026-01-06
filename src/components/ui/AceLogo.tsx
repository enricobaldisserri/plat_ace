export const AceLogo = ({ size = 24, className = "" }: { size?: number; className?: string }) => (
    <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={className}
    >
        {/* Stylized Spade shape representing ACE */}
        <path d="M12 2L4.5 10.5C3 12.5 3.5 15.5 6 17.5C8 19 10 18.5 12 17C14 18.5 16 19 18 17.5C20.5 15.5 21 12.5 19.5 10.5L12 2Z" fill="currentColor" />
        <path d="M12 17V22" />
        <path d="M9 22H15" />
        {/* Circuit-like detail on the spade */}
        <circle cx="12" cy="9" r="1" fill="white" stroke="none" />
        <path d="M12 10V14" stroke="white" strokeWidth="1" />
    </svg>
);
