// version must be structured as (canonical)_v(number)
const versionRegex = /^(.+)_v(\d+)$/;

const versioner = function versioner(name) {
  const versionMatch = name.match(versionRegex);
  const isVersioned = Array.isArray(versionMatch);
  const canonical = isVersioned ? versionMatch[1] : name;
  const version = isVersioned ? parseInt(versionMatch[2], 10) : 0;

  return { canonical, version };
};

module.exports = versioner;
