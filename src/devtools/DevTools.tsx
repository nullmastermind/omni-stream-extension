import "./DevTools.css";

export const DevTools = () => {
  const link = "https://github.com/guocaoyi/create-chrome-ext";

  return (
    <main>
      <h3>DevTools Page</h3>
      <a href={link} target="_blank">
        generated by create-chrome-ext
      </a>
    </main>
  );
};

export default DevTools;
