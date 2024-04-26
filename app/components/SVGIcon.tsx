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

  export const SVGLoader = () => (
    <svg
      className="loader"
      viewBox="0 0 250 250"
      style={{ width: '35px', height: '35px' }}
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