import {
  aboutPage,
  renderLandingPage,
  validateOwnDomain,
  validateCookie,
  urlAlreadyTrimmedByUser,
  stripUrl,
  userFeedback
} from "../middlewares/middlewares";
import {
  getUrlAndUpdateCount,
  trimUrl,
  deleteUrl,
  redirectUrl
} from "../controllers/urlController";

export const initRoutes = app => {
  app.get("/", validateCookie, renderLandingPage);
  app.get("/about", (req, res) => res.status(200).render("about"));
  app.post(
    "/",
    stripUrl,
    validateOwnDomain,
    urlAlreadyTrimmedByUser,
    trimUrl
  );
  app.get("/about", aboutPage);

  app.get("/feedback", userFeedback); //working on post routes


  app.get("/:id", getUrlAndUpdateCount);
  app.all("*", (req, res) => res.status(404).render("error"));
};