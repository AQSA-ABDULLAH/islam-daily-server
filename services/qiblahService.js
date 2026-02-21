const KAABA_LAT = 21.4225;
const KAABA_LNG = 39.8262;

const toRadians = (deg) => deg * (Math.PI / 180);
const toDegrees = (rad) => rad * (180 / Math.PI);

const calculateQiblahDirection = (lat, lng) => {
  const userLatRad = toRadians(lat);
  const userLngRad = toRadians(lng);
  const kaabaLatRad = toRadians(KAABA_LAT);
  const kaabaLngRad = toRadians(KAABA_LNG);

  const dLng = kaabaLngRad - userLngRad;

  const y = Math.sin(dLng) * Math.cos(kaabaLatRad);
  const x =
    Math.cos(userLatRad) * Math.sin(kaabaLatRad) -
    Math.sin(userLatRad) * Math.cos(kaabaLatRad) * Math.cos(dLng);

  const angle = toDegrees(Math.atan2(y, x));
  return (angle + 360) % 360; // always positive
};

module.exports = { calculateQiblahDirection };