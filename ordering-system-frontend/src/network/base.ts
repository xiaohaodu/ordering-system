const base = {
  // url: "https://os.api.mayuan.work",
  // url: "http://127.0.0.1:9000",
  url: process.env.NODE_ENV === "production" ? "api" : "http://127.0.0.1:9000",
  frontendUrl:
    process.env.NODE_ENV === "production"
      ? "https://os.mayuan.work/"
      : "http://localhost:9010/",
};
export default base;
