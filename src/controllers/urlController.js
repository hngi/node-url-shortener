import UrlShorten from "../models/UrlShorten";
import nanoid from "nanoid";
import { DOMAIN_NAME } from "../config/constants";
import { respondWithWarning } from '../helpers/responseHandler';

/**
 * This function trims a new url that hasn't been trimmed before
 * @param {object} req
 * @param {object} res
 * @returns {object} response object with trimmed url
 */
export const trimUrl = async (req, res) => {
	try {
      // Generate short code
      let newUrlCode = nanoid(5);

      const newTrim = new UrlShorten({
        long_url: req.url,
        clipped_url: `${DOMAIN_NAME}/${newUrlCode}`,
        urlCode: newUrlCode,
        created_by: req.cookies.userID,
        click_count: 0
      });

      newTrim.save((err, newTrim) => {
        if (err) {
          const result = respondWithWarning(res, 500, "Server error");
          return result;
        }
        
        res.status(201).json({
          success: true,
          payload: newTrim
        });
      });
  } 
  catch (err) {
    console.log(err)
    const result = respondWithWarning(res, 500, "Server error");
    return result;
  }
};

/**
 * This function gets original url by the trim code supplied as a parameter
 * e.g trim.ly/TRIM_CODE
 * @param {object} req
 * @param {object} res
 * @returns {object} next middleware
 */
export const getUrlAndUpdateCount = async (req, res, next) => {
  try {
    const { id } = req.params;
    const url = await UrlShorten.findOne({
      urlCode: id
    });

    if (!url) {
      return res.status(404).render('error');
    }
    url.click_count += 1;
    await url.save();
		
		if(url.long_url.startsWith('http'))
			return res.redirect(url.long_url);
		else 
			res.redirect(`http://${url.long_url}`);
  } catch (error) {
    return res.status(404).render('error');
  }
};
