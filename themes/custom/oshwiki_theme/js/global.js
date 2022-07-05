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

/*After ajax calls - used in themes*/
(function ($) {
  $(document).ajaxStop(function() {
    if($("body").hasClass("page-view-themes")){
      selectTheme();
    }
  });
}(jQuery));
/*After ajax calls - used in themes*/

jQuery(window).on("load",function(){
  checkResponsiveMenu(jQuery(window).width(), menuSM);
  hideOriginalContentTextAfterSearch();
  /*For the theme page call 'selectThemes' function with ajaxStop*/
  if(!jQuery("body").hasClass("page-view-themes")){
    selectTheme();
  }else{
    /*If there is no user logged, call the 'selectTheme' function because it won't call the ajaxStop*/
    if(!jQuery("body").hasClass("user-logged-in")){
      selectTheme();
    }
  }
});

jQuery(window).resize(function(){
  checkResponsiveMenu(jQuery(window).width(), menuSM);
  setParagraphImageTextWidth();
  createDivCardsHomePage();
  createDivCards("node--type-oshwiki-articles",['.related-articles']);
});

jQuery(document).ready(function($) {
  let theURL=$(location).attr("href");
  addPlaceholder();
  checkFooterMargin();
  $("button.navbar-toggler-right").click(setMenuResponsiveSearchBoxMargin);
  themeAlfabethicalViewTabs(theURL);
  articleParagraphImage('.section_most_popular', '.section_most_recent');
  createDivCardsHomePage();
  createDivCards("node--type-oshwiki-articles",['.related-articles']);

  /*Set the margin for the search box inside responsive menu*/
  function setMenuResponsiveSearchBoxMargin(){
    if(jQuery(window).width()<993){
      if($(this).next().hasClass("show")){
        $(".responsive-menu-oshwiki").css("margin", "0rem");
        $("#search-icon-responsive").css("margin-left", "0rem");
      }else{
        $(".responsive-menu-oshwiki").css("margin", "0.5rem 0rem 0.5rem 0rem");
        $("#search-icon-responsive").css("margin-left", "1rem");
      }
    }
  }

  /*Add placeholder to search inputs*/
  function addPlaceholder(){
    $(".header-language-search > section .search-block-form input").attr("placeholder", "Search");
    if($("body").hasClass("page-view-frontpage")){
      $(".home-banner-search .search-block-form input").attr("placeholder", "Search");
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

  /*Is we are at the theme or alphabetical views, mark the correct tab as show-subthemes*/
  function themeAlfabethicalViewTabs(theURL){
    if(theURL.includes("alphabetical-view")){
      $("#nav-alphabetical-view-tab").addClass("show-subthemes");
    } else if(theURL.includes("theme")){
      $("#nav-themes-tab").addClass("show-subthemes");
    }
  }

  /*Add border-radius to the last item of the media paragraph*/
  /*Obtain the width of the paragraph images and set it as the max-width of the image text*/
  function articleParagraphImage(){
    if($("body").hasClass("node--type-oshwiki-articles")){
      /*If the paragraph has images and the images have no text, add border radius to the image*/
      $('.field--name-field-media > .field__item > .contextual-region').each(function(index, value){
        if(($(this).find('.field--name-field-caption-copyrigth-').length==0)&&($(this).find('.field--name-field-copyrigth').length==0)){
          $(this).find('.field--name-field-media-image > .field__item > img').css("border-radius", "20px");
        }else if($(this).find('.field--name-field-caption-copyrigth-').length==0){
          /*If the only text is the copyright text, increase the padding in order to prevent issues with the border-radius*/
          $(this).find('.field--name-field-copyrigth').css({"border-radius": "0px 0px 20px 20px", "padding":"0.2rem 0.5rem"});
        }else{
          $(this).find('.field--name-field-caption-copyrigth-').css("border-radius", "0px 0px 20px 20px");
        }
      });
    }
    setParagraphImageTextWidth();
  }

});

/*Call both functions required for the select theme behaviour*/
function selectTheme(){
  hideEverySubthemeCatNotSelected();
  createNewSpanForThemeIcon();
}

/*If there is no active category, collapse the theme. If there is, display the theme*/
function hideEverySubthemeCatNotSelected(){
  jQuery(".facets-widget-links > ul > .facet-item--expanded").each(function(index, value){
    if((jQuery(this).hasClass("facet-item--show-subthemes-trail")) || (jQuery(this).find("a").hasClass("show-subthemes")) || (jQuery(this).find("a").hasClass("is-active"))){
      jQuery(this).addClass("show-subthemes");
      jQuery(this).removeClass("hide-subthemes");
    }else{
      jQuery(this).addClass("hide-subthemes");
      jQuery(this).removeClass("show-subthemes");
    }

  });
}

/*Add span tags inside the list elements*/
function createNewSpanForThemeIcon(){
  if(jQuery(".facets-widget-links > ul > .facet-item").find(".showSubthemes").length==0){
    jQuery(".facets-widget-links > ul > .facet-item > a").after("<span class='showSubthemes'></span>");
  }
  if(jQuery(".facets-widget-links .item-list__links .facets-widget- ul li a").find(".iconSubtheme").length==0){
    jQuery(".facets-widget-links .item-list__links .facets-widget- ul li a .facet-item__value").before("<span class='iconSubtheme'></span>");
  }

  if(!(jQuery("body").hasClass("page-view-frontpage"))){
    /*When the theme is clicked, toggle subthemes*/
    jQuery(".showSubthemes").off().click(function(){
      if(jQuery(this).parent().hasClass("show-subthemes")){
        jQuery(this).parent().removeClass("facet-item--show-subthemes-trail");
        jQuery(this).parent().removeClass("show-subthemes");
        jQuery(this).parent().addClass("hide-subthemes");
      }else if (jQuery(this).parent().hasClass("hide-subthemes")){
        jQuery(this).parent().addClass("show-subthemes");
        jQuery(this).parent().removeClass("hide-subthemes");
      }
    });
  }
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

/*Obtain the width of the paragraph images and set it as the max-width of the image text*/
function setParagraphImageTextWidth(){
  if(jQuery("body").hasClass("node--type-oshwiki-articles")){
    let everyParagraphMediaItem = '.field--name-field-sections-oshwiki > ' +
      '.field__item .paragraph--type--sections-paragraph ' +
      '.field--name-field-media > .field__item';
    jQuery(everyParagraphMediaItem).each(function(index,value){
      let imageWidth=jQuery(this).find('img').innerWidth()+"px";
      jQuery(this).find('.field--name-field-copyrigth').css({"max-width":imageWidth, "width":imageWidth});
      jQuery(this).find('.field--name-field-caption-copyrigth-').css({"max-width":imageWidth, "width":imageWidth});
    })
  }
}

/*After searching for content in the General Search, hide the original article description text*/
function hideOriginalContentTextAfterSearch(){
  if(jQuery("body").hasClass("page-view-search")){
    if(jQuery(".block-system-main-block .view-content .views-row").find(".views-field-search-api-excerpt").lenght>0){
      jQuery(".block-system-main-block .view-content .views-row").find(".views-field-field-sections-oshwiki").hide();
    }
  }
}

/*If there is a theme inside an other sources of information journal,
change the wrapper's grid-template-rows and add empty divs in order to maintain layout*/
function createDivCardsHomePage(){
  if(jQuery("body").hasClass("page-view-frontpage")){
    if(jQuery(".section_other_sources .card-content-wrapper").find('.theme-badge').length>0){
      jQuery(".section_other_sources .card-content-wrapper").css("grid-template-rows", "auto 1.5fr 35px");
      createDivCards("page-view-frontpage",['.section_most_popular', '.section_most_recent', '.section_other_sources']);
    }else{
      createDivCards("page-view-frontpage",['.section_most_popular', '.section_most_recent']);
    }
  }
}

/*If the content card does not have a tag create a div with the tag classes,
set the height of the tags with the height of the largest tag
and set de title height with the maxHeight in order to mantain the layout*/
function createDivCards(bodyClass, cardWrapperNames){
  if(jQuery("body").hasClass(bodyClass)){
    let contentTypes = cardWrapperNames;
    for(let i=0; i<contentTypes.length;i++){
      let maxHeightOfTheme = 0;
      let maxHeightOfTitle = 0;
      jQuery(contentTypes[i]+" .card-content-wrapper").each(function(index, value){
        if((jQuery(this).find('.theme-badge').length==0)&&(jQuery(this).find('.transparent-tag').length==0)){
          /*Add the "transparent-tag" class for the css*/
          jQuery(this).prepend("<div class='taxonomy-level-wrapper transparent-tag'>" +
            "<div class='taxonomy-level-item type-themes'>" +
            "<span>tag</span>\n" +
            "</div>" +
            "</div>");
        }
        /*Set height for the tags of the articles*/
        if((jQuery.isNumeric(jQuery(this).find('.theme-badge').height()))&&(jQuery(this).find('.theme-badge').height()>maxHeightOfTheme)){
          maxHeightOfTheme=jQuery(this).find('.theme-badge').height();
        }
        /*Set height for the titles of the articles*/
        if((jQuery.isNumeric(jQuery(this).find('a:first').height()))&&(jQuery(this).find('a:first').height()>maxHeightOfTitle)){
          maxHeightOfTitle=jQuery(this).find('a:first').height();
        }
      });
      /*Change the grid layout*/
      let gridTemplateRowValues = maxHeightOfTheme + "px " + maxHeightOfTitle + "px 35px";
      jQuery(contentTypes[i]+" .card-content-wrapper").css("grid-template-rows", gridTemplateRowValues);
    }
  }
}
