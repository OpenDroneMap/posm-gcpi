export const getUtmZoneFromLatLng = (lat, lng) => {
  // Standard UTM zones don't apply to polar regions
  if (lat < -80 || lat > 84) return null;
  return {
    zone: (Math.floor((lng + 180) / 6) % 60) + 1,
    hemisphere: lat >= 0 ? 'north' : 'south'
  }
};

export const getProj4Utm = (zone, hemisphere) => {
  return `+proj=utm +zone=${zone} ${hemisphere === 'north' ? '' : '+south '}+ellps=WGS84 +datum=WGS84 +units=m +no_defs`;
}

export const getUtmDescriptor = (zone, hemisphere) => {
  return `WGS84 UTM ${zone}${hemisphere === 'north' ? 'N' : 'S'}`;
}

export const parseUtmDescriptor = (descriptor) => {
  if (descriptor.indexOf('WGS84 UTM') !== 0) return null;
  const zoneCode = descriptor.split(' ').slice('-1')[0].trim();
  return {
    zone: zoneCode.slice(0, -1),
    hemisphere: zoneCode.slice(-1) === 'N' ? 'north' : 'south'
  };
}
