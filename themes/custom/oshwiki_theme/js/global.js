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



jQuery(window).on("load",function(){
  hideEverySubthemeCat();
  createNewSpanForThemeIcon();
  /*REMOVE*/
  /*REMOVE*/
});

jQuery(document).ready(function($) {
  let theURL=$(location).attr("href");
  checkFooterMargin();
  themeAlfabethicalViewTabs(theURL);
  checkIfParagraphImgHasText('.section_most_popular', '.section_most_recent');
  createDivCards("page-view-frontpage",['.section_most_popular', '.section_most_recent']);
  createDivCards("node--type-oshwiki-articles",['.related-articles']);


  /*If there is a "related-article" div, remove the margin-top*/
  function checkFooterMargin(){
    if($("body").find(".section").find(".related-articles").length==0){
      $("footer").addClass("addMarginTop");
    }else{
      $("footer").addClass("removeMarginTop");
    }
  }

  /*Is we are at the theme or alphabetical views, mark the correct tab as active*/
  function themeAlfabethicalViewTabs(theURL){
    if(theURL.includes("alphabetical-view")){
      $("#nav-alphabetical-view-tab").addClass("active");
    } else if(theURL.includes("theme")){
      $("#nav-themes-tab").addClass("active");
    }
  }

  /*If the paragraph has images and the images have no text, add border radius*/
  function checkIfParagraphImgHasText(){
    if($("body").hasClass("node--type-oshwiki-articles")){
      $('.field--name-field-media > .field__item > .contextual-region').each(function(index, value){
        if($(this).find('.field--name-field-caption-copyrigth-').length==0){
          $(this).find('.field--name-field-media-image > .field__item > img').css("border-radius", "20px");
        }
      });
    }
  }

  /*If the content card does not have a tag,
  create a div with the tag classes in order to mantain the layout*/
  function createDivCards(bodyClass, cardWrapperNames){
    if($("body").hasClass(bodyClass)){
      let contentTypes = cardWrapperNames;
      for(let i=0; i<contentTypes.length;i++){
        $(contentTypes[i]+" .card-content-wrapper").each(function(index, value){
          if($(this).find('.theme-badge').length==0){
            $(this).prepend("<div class='taxonomy-level-wrapper'></div>");
          }
        });
      }
    }
  }
});

/*Hide all the subthemes when document ready*/
function hideEverySubthemeCat(){
  jQuery(".facets-widget-links > ul > .facet-item--expanded").find(".facets-widget-").hide();
}

/*Add span tags inside the list elements*/
function createNewSpanForThemeIcon(){
  jQuery(".facets-widget-links > ul > .facet-item--expanded > a").after("<span class='showSubthemes'></span>");

  /*When the theme is clicked, toggle subthemes*/
  jQuery(".showSubthemes").click(function(){
    jQuery(this).parent().toggleClass("active");
    jQuery(this).parent().find(".facets-widget-").toggle(300);
  });
}

