var gameTheme = {
  themes: {
    classic: { label: "Classic" },
    ocean: { label: "Ocean" },
    contrast: { label: "High contrast" }
  },
  current: "classic",

  apply: function(name) {
    this.current = this.themes[name] ? name : "classic";
    if (typeof document !== "undefined" && document.body) {
      document.body.setAttribute("data-theme", this.current);
    }
    return this.current;
  },

  isAvailable: function(name) {
    return Boolean(this.themes[name]);
  }
};
