$(document).ready(function() {
  $('button[class*="btn--action-menu"]').on('click', function() {
    $(
      'body, .sidebar-container, .btn--action-menu-close, .content-container'
    ).toggleClass('show-menu');
    //$(this).find('i.fa').toggleClass('fa-bars fa-times');
  });

  $('div[class*="menu-item-"] .title').on('click', function() {
    var self = this;
    var parent = $(self).parents('div[class*="menu-item-"]');
    $(
      `.list-heading-${$(parent)
        .prop('class')
        .substring($(parent).prop('class').length - 1)}`
    ).slideToggle(400, 'swing', function() {
      //Animation Complete
      $(parent).find('.caret > i').toggleClass('fa-chevron-down fa-chevron-up');
    });
  });
  /*
  $('.btn--upload-image').on('click', function() {
    console.log('clicked');
    $('#avatar').click();
  });
  */
  /*
  $('#avatar').on('change', function() {
    if (this.files.length > 0) {
      var file = this.files[0];
      $('#avatar_holder').val(file.name);
    }
  });*/
});
