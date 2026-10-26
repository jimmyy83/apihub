import { Router } from "express";
import {
  getResponseHeaders,
  sendBrotliResponse,
  sendGzipResponse,
  sendHTMLTemplate,
  sendXMLData,
  setCacheControlHeader,
} from "../../controllers/kitchen-sink/responseinspection.controllers.js";
import { setCacheControlHeaderValidator } from "../../validators/kitchen-sink/responseinspection.validators.js";
import { validate } from "../../validators/validate.js";
import compression from "compression";

const router = Router();

router
  .route("/cache/:timeToLive/:cacheResponseDirective")
  .get(setCacheControlHeaderValidator(), validate, setCacheControlHeader);
router.route("/headers").get(getResponseHeaders);
router.route("/html").get(sendHTMLTemplate);
router.route("/xml").get(sendXMLData);

// `compression` prefers brotli when the client accepts it, so drop `br` to keep this route gzip encoded
const acceptGzipOnly = (req, res, next) => {
  req.headers["accept-encoding"] = req.headers["accept-encoding"]
    ?.split(",")
    .filter((encoding) => encoding.trim().split(";")[0] !== "br")
    .join(",");
  next();
};

router.route("/gzip").get(acceptGzipOnly, compression(), sendGzipResponse);
router.route("/brotli").get(compression(), sendBrotliResponse);

export default router;
