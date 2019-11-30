NB.boardVM = new NB.BoardViewModel();

(function(): void {
  window.onload = function(): void {
    ko.applyBindings(NB.boardVM);
    configureElementsByLanguage();
  };
})();

const configureElementsByLanguage = () => {
  let elements = document.querySelectorAll("span");
  elements.forEach(el => el.setAttribute("dir", "rtl"));
  elements = document.querySelectorAll("input");
  elements.forEach(el => el.setAttribute("style", "text-align:right"));

  // dir="rtl"
};
// custom binding

ko.bindingHandlers.placeholder = {
  init: function(element, valueAccessor, allBindingsAccessor) {
    var underlyingObservable = valueAccessor();
    ko.applyBindingsToNode(element, {
      attr: { placeholder: underlyingObservable }
    });
  }
};
