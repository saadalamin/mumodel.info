"use strict";
(function (window) {
 const $$$ = function () {
  /*------------------------------------------------
        Global
        -
        @ 
     */
  /////
  const $fade = function () {
   let elementsArray = [
    ...document.querySelectorAll(".__home .__section-two .row>div"),
    ...document.querySelectorAll(".__home .__section-three .row>div"),
    ...document.querySelectorAll(".__facilities .row>div"),
    ...document.querySelectorAll(".__home .__about-section .row>div>*"),

   ];

   function fadeIn(elem) {
    if (elem == null) return;
    var distInView = elem.getBoundingClientRect().top - window.innerHeight;
    if (distInView) {
     elem.classList.add("__animation");
     if (distInView < 0) {
      elem.classList.add("active");
     } else {
      elem.classList.remove("active");
     }
    }
   }

   window.addEventListener("scroll", function () {
    for (var i = 0; i < elementsArray.length; i++) {
     if (typeof elementsArray[i] == "undefined") continue;
     fadeIn(elementsArray[i]);
    }
   });
  };
  window.addEventListener("load", function () {
   $fade();
  });
  /*------------------------------------------------
        Home Page Interaction
        -
        @ 
        ------------------------------------------------
      */
  //////
 };
 window.addEventListener("load", $$$);
 document.addEventListener("DOMContentLoaded", $$$);
})(window || {});
