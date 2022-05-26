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

/*This variable tells us if the responsive menu is currently collapsed (true)*/
let menuSM = false;

jQuery(window).on("load",function(){
  selectTheme();
  checkResponsiveMenu(jQuery(window).width(), menuSM);
});

jQuery(window).resize(function(){
  checkResponsiveMenu(jQuery(window).width(), menuSM);
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
            /*Add the "transparent-tag" class for the css*/
            $(this).prepend("<div class='taxonomy-level-wrapper transparent-tag'>" +
              "<div class='taxonomy-level-item type-themes'>" +
              "<span>tag</span>\n" +
              "</div>" +
              "</div>");
          }
        });
      }
    }
  }

});

/*Call both functions required for the select theme behaviour*/
function selectTheme(){
  hideEverySubthemeCatNotSelected();
  createNewSpanForThemeIcon();
}

/*If there is no active category, collpase the theme. If there is, display the theme*/
function hideEverySubthemeCatNotSelected(){
  jQuery(".facets-widget-links > ul > .facet-item--expanded").each(function(index, value){
    if(!(jQuery(this).hasClass(".facet-item--active-trail")) && !(jQuery(this).find("a").hasClass("is-active"))){
      jQuery(this).find(".facets-widget-").hide();
    }else{
      jQuery(this).addClass("active");
    }
  });
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

/*Check window width and if the menu is collapsed or not
* 2 parameters: window width and menu status*/
function checkResponsiveMenu(windowWidth, menuSmall){
  if (windowWidth < 992) {
    if(!menuSmall){
      /*Add header elements to menu navbar and create new element for icon*/
      jQuery("#navbar-main").append("<div class='responsive-menu-oshwiki'></div>");
      jQuery("#block-languagedropdownswitcher").appendTo(".responsive-menu-oshwiki");
      jQuery("<div id='search-icon-responsive'></div>").appendTo(".responsive-menu-oshwiki");
      jQuery("#block-oshwiki-theme-search").appendTo(".responsive-menu-oshwiki");

      /*When the magnifying glass icon is clicked, show the shearch block and hide the magnifying glass icon*/
      jQuery("#search-icon-responsive").click(function(){
        jQuery("#block-oshwiki-theme-search").show();
        jQuery(this).hide();
      });

      /*Hide the header elements not requied for the responsive version*/
      jQuery("#block-oshwiki-theme-search").hide();
      jQuery(".font-size-print").hide();

      menuSM = true;
    }
  }else{
    if(menuSmall){
      /*Move the elements from the menu back to the header*/
      jQuery("#block-oshwiki-theme-search").appendTo(".header-language-search .region-top-header-form");
      jQuery("#block-languagedropdownswitcher").appendTo(".header-language-search .region-top-header-form");

      /*Toggle and remove required elements*/
      jQuery(".responsive-menu-oshwiki").remove();
      jQuery("#block-oshwiki-theme-search").show();
      jQuery(".font-size-print").toggle();
      menuSM = false;
    }
  }
}
