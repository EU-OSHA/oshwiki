/**
 * @file
 * Global utilities.
 *
 */
(function ($, Drupal) {

  'use strict';

  Drupal.behaviors.allages_theme = {
    attach: function (context, settings) {
    }
  };


})(jQuery, Drupal);

jQuery(document).ready(function($) {
  /*REMOVE*/
  $(".facet-item__count").hide();
  $(".view-footer").hide();
  /*REMOVE*/
  let theURL=$(location).attr("href");
  hideEverySubthemeCat();
  createNewSpanForThemeIcon();
  checkFooterMargin();
  themeAlfabethicalViewTabs(theURL);

  if($("body").hasClass("node--type-oshwiki-articles")){

  }

  /*Is we are at the theme or alphabetical views, mark the correct tab as active*/
  function themeAlfabethicalViewTabs(theURL){
    if(theURL.includes("theme")){
      $("#nav-themes-tab").addClass("active");
    } else if(theURL.includes("alphabetical-view")){
      $("#nav-alphabetical-view-tab").addClass("active");
    }
  }

  /*If there is a "related-article" div, remove the margin-top*/
  function checkFooterMargin(){
    if($("body").find(".section").find(".related-articles").length==0){
      $("footer").addClass("addMarginTop");
    }else{
      $("footer").addClass("removeMarginTop");
    }
  }

  /*Add span tags inside the list elements*/
  function createNewSpanForThemeIcon(){
    $(".facets-widget-links > ul > .facet-item--expanded > a").after("<span class='showSubthemes'></span>");

    /*When the theme is clicked, toggle subthemes*/
    $(".showSubthemes").click(function(){
      $(this).parent().toggleClass("active");
      $(this).parent().find(".facets-widget-").toggle(300);
    });
  }

  /*Hide all the subthemes when document ready*/
  function hideEverySubthemeCat(){
    $(".facets-widget-links > ul > .facet-item--expanded").find(".facets-widget-").hide();
  }
});


