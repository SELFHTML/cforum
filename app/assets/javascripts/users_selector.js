/* -*- coding: utf-8 -*- */
/* global cforum, Mustache */

cforum.common.usersSelector = $({});

cforum.common.usersSelector.selectedUsers = [];
cforum.common.usersSelector.foundUsers = [];

cforum.common.usersSelector.search = function(obj) {
  $.get(
    cforum.baseUrl + '/users.json',
    's=' + encodeURIComponent(obj.find(".user_search").val()),
    'json'
  ).
  success(function(data) {
    var sel = obj.find(".user-list");
    var the_html = "";

    cforum.common.usersSelector.foundUsers = [];

    for(var i = 0; i < data.length; ++i) {
      cforum.common.usersSelector.foundUsers[data[i].user_id] = data[i];
      the_html += Mustache.render(cforum.common.usersSelector.views.userFoundLine, {user: data[i]});
    }

    sel.html(the_html);
    sel.find("li").fadeIn('fast');
  });
};

cforum.common.usersSelector.add = function(ev) {
  var $obj  = $(ev.target).closest(".found-user-line");
  var $sel  = $obj.closest(".users-selector");
  var found = $sel.find(".found-user-list");
  var uid   = $obj.attr('data-user-id');
  var uname = $obj.attr('data-username');

  var has_it = false;
  found.find("li").each(function() {
    if($(this).attr("data-user-id") == uid) {
      has_it = true;
    }
  });

  if(has_it) {
    return;
  }

  var html  = Mustache.render(cforum.common.usersSelector.views.userAddLine, {user: {user_id: uid, username: uname}});

  if($sel.hasClass('single')) {
    found.html(html);
    cforum.common.usersSelector.selectedUsers = cforum.common.usersSelector.foundUsers[uid];
  }
  else {
    cforum.common.usersSelector.selectedUsers[uid] = cforum.common.usersSelector.foundUsers[uid];
    found.append(html);
  }

  found.find("li:last").fadeIn('fast');
};


cforum.common.usersSelector.select = function(event) {
  event.preventDefault();

  var $selector = $(this).closest(".users-selector");
  var found = $selector.find(".found-user-list");
  var $sel = $selector.find(".users");

  if($selector.hasClass('single')) {
    $sel.html("");
  }

  found.find("li").each(function() {
    var $this = $(this);
    $sel.append(
      Mustache.render(
        cforum.common.usersSelector.views.userLine,
        {user: {user_id: $this.attr("data-user-id"), username: $this.attr("data-username")}, name: $sel.attr("data-name"), id: $sel.attr("data-id")}
      )
    );
  });

  $(this).closest('.users-selector').find('.users-modal').modal('hide');
  cforum.common.usersSelector.trigger('users-selector:selected', [cforum.common.usersSelector.selectedUsers]);
};

cforum.common.usersSelector.remove = function(ev) {
  var $obj = $(ev.target);
  $obj.closest("li").fadeOut('fast', function() {
    $(this).remove();
  });
};

cforum.common.usersSelector.unselect = function(ev) {
  var $obj = $(ev.target);
  $obj.closest("label").fadeOut('fast', function() {
    $(this).remove();
  });
};

cforum.common.usersSelector.initiateSearch = function() {
  var $this = $(this);
  var tm = $this.data('timeout');
  if(tm) {
    window.clearTimeout(tm);
  }

  tm = window.setTimeout(function() {
    cforum.common.usersSelector.search($this.closest(".users-selector"));
  }, 1500);
  $this.data("timeout", tm);
};

cforum.common.usersSelector.init = function() {
  $(".users-selector .users-modal").modal({show: false});
  $(".users-selector .add-user").click(function() { $(this).closest(".users-selector").find(".users-modal").modal('show'); });
  $(".users-selector .user_search").keyup(cforum.common.usersSelector.initiateSearch);
  $(".users-selector .ok").click(cforum.common.usersSelector.select);
  $(".users-selector .user-list").click(cforum.common.usersSelector.add);
  $(".users-selector .found-user-list").click(cforum.common.usersSelector.remove);
  $(".users-selector .users").click(cforum.common.usersSelector.unselect);

  $(".users-selector .cancel").click(function(event) {
    event.preventDefault();
    $(this).closest(".users-selector").find(".users-modal").modal('hide');
  });
};

cforum.common.usersSelector.views = {
  userFoundLine: '<li style="display:none" class="found-user-line" data-user-id="{{user.user_id}}" data-username="{{user.username}}"><i class="icon-add"> </i> {{user.username}}</li>',
  userAddLine: '<li style="display:none" data-user-id="{{user.user_id}}" data-username="{{user.username}}"><i class="icon-remove"> </i> {{user.username}}</li>',
  userLine: '<label class="checkbox"><input type="checkbox" checked="checked" value="{{user.user_id}}" name="{{name}}" id="{{id}}"> {{user.username}}</label>'
};

$(document).ready(function() {
  cforum.common.usersSelector.init();
});

/* eof */
