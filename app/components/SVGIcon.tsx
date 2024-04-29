export const EyeIcon = () => {
  return (
    <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M12 15c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.76 5-5 5zm0-7a2 2 0 1 0 0 4 2 2 0 0 0 0-4zm0 7c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2z"
        fill="currentColor"
      />
    </svg>
  );
};

export const PasswordEye = () => {
  return (
  <svg 
  className="h-6 w-6"
  fill="none"
  xmlns="http://www.w3.org/2000/svg" 
  viewBox="0 0 24 24" id="password">
    <g>
      <path 
        d="M19,20H5a4,4,0,0,1-4-4V12A4,4,0,0,1,5,8H19a4,4,0,0,1,4,4v4A4,4,0,0,1,19,20ZM5,10a2,2,0,0,0-2,2v4a2,2,0,0,0,2,2H19a2,2,0,0,0,2-2V12a2,2,0,0,0-2-2Z"
          fill="currentColor"
        />
    <path 
    fill="currentColor"
    d="M19,10H5V8A7,7,0,0,1,19,8ZM7,8H17A5,5,0,0,0,7,8Z" />
    <path 
    d="M19,9H5a3,3,0,0,0-3,3v4a3,3,0,0,0,3,3H19a3,3,0,0,0,3-3V12A3,3,0,0,0,19,9ZM6,15a1,1,0,1,1,1-1A1,1,0,0,1,6,15Zm4,0a1,1,0,1,1,1-1A1,1,0,0,1,10,15Zm4,0a1,1,0,1,1,1-1A1,1,0,0,1,14,15Zm4,0a1,1,0,1,1,1-1A1,1,0,0,1,18,15Z"
    fill="currentColor"
    />
    </g>
    </svg>
  )
}

  const styles = {
    loader: {
      animationName: 'rotate',
      width: '50px',
      height: '50px',
    },
    '@keyframes rotate': {
      from: { transform: 'rotate(0deg)' },
      to: { transform: 'rotate(360deg)' },
    },
  };

  interface SVGLoaderProps {
    style?: React.CSSProperties; // Define style prop of type CSSProperties
  }

  export const SVGLoader: React.FC<SVGLoaderProps> = (props) => (
    <svg
      className="loader"
      viewBox="0 0 250 250"
      style={props.style}
    >
      <circle
        className="path"
        cx="125"
        cy="125"
        r="100" // Increase the radius to make a larger circle
        fill="none"
        strokeWidth="5"
        strokeLinecap="round"
        stroke="#ccc" // Color of the spinner
        strokeDasharray="157"
        strokeDashoffset="0"
      >
        <animateTransform
          attributeName="transform"
          type="rotate"
          from="0 125 125" // Start angle and center of rotation
          to="360 125 125" // End angle and center of rotation
          dur="1.5s" // Duration of one rotation
          repeatCount="indefinite" // Make the animation repeat indefinitely
        />
      </circle>
    </svg>
  );

  interface CopyIconProps {
    style?: React.CSSProperties;
    fill?: '#FFFFFF';
    opacity: 1;
  }

export const CopyIcon: React.FC<CopyIconProps> = (props) => (
  <svg
  width="24"
  height="24"
  viewBox="0 0 24 24"
  xmlns="http://www.w3.org/2000/svg"
  style={props.style}
>
  <g transform="matrix(1 0 0 1 12 12)">
    <path
      d="M 4 2 C 2.895 2 2 2.895 2 4 L 2 17 C 2 17.552 2.448 18 3 18 C 3.552 18 4 17.552 4 17 L 4 4 L 17 4 C 17.552 4 18 3.552 18 3 C 18 2.448 17.552 2 17 2 L 4 2 z M 8 6 C 6.895 6 6 6.895 6 8 L 6 20 C 6 21.105 6.895 22 8 22 L 20 22 C 21.105 22 22 21.105 22 20 L 22 8 C 22 6.895 21.105 6 20 6 L 8 6 z M 8 8 L 20 8 L 20 20 L 8 20 L 8 8 z"
      strokeLinecap="round"
      fillRule="nonzero"
      transform="translate(-12, -12)"
    />
  </g>
</svg>
)
