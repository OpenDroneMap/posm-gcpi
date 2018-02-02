/*
  Minimum of 5 locations
  Each location must contain points from 3 different images
  A valid GCP file must have a minimum of 15 rows
 */

const validLocation = (loc) => {
  if (!Array.isArray(loc)) return false;
  return loc.length === 2 && (loc.every(d => !isNaN(d)));
};

const gcpValidator = (points) => {
  if (points.length < 15) {
    console.warn('Not enough points. Need at least 15 points.');
    return false;
  }

  // unique map location points
  let uniques = {};
  points.forEach(pt => {
    let loc = pt.locations;
    if (!loc) return;

    if (!validLocation(loc.map) || !validLocation(loc.image)) return;

    let k = loc.map.join(':');

    if (!uniques[k]) uniques[k] = { ct: 0, imgs: [] };
    uniques[k].ct++;
    uniques[k].imgs.push(pt.img);
  });

  // check if each point has 3 images associated with it
  let valid = Object.keys(uniques).filter(d => d.imgs >= 3);

  if (valid.length < 5) {
    console.warn('A point on the map must be referenced in 3 images.');
    return false;
  }

  return true;
};

export default gcpValidator;