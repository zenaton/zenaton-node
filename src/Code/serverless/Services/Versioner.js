// version must be structured as (canonical)_v(number)
const versionRegex = /^(.+)_(v\d+)$/;

const versioner = function versioner(name) {
  const versionMatch = name.match(versionRegex);
  const isVersioned = Array.isArray(versionMatch);
  const canonical = isVersioned ? versionMatch[1] : name;
  const version = isVersioned ? versionMatch[2] : null;

  return { canonical, version, name };
};

module.exports = versioner;
