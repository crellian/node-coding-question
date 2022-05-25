const express = require('express');
const fs = require('fs');
const path = require('path');

function time_diff(time){
    var now = new Date().toISOString()
    if(time.substring(0,4)-now.substring(0,4) != 0){
        return 'uploaded '+(now.substring(0,4)-time.substring(0,4)) + 'years ago';
    } else if(time.substring(5,7)-now.substring(5,7) != 0){
        return 'uploaded '+(now.substring(5,7)-time.substring(5,7))  + 'months ago';
    } else if(time.substring(8,10)-now.substring(8,10) != 0){
        return 'uploaded '+(now.substring(8,10)-time.substring(8,10)) + 'days ago';
    } else if(time.substring(11,13)-now.substring(11,13) != 0){
        return 'uploaded '+(now.substring(11,13)-time.substring(11,13)) + 'hours ago';
    } else if(time.substring(14,16)-now.substring(14,16) != 0){
        return 'uploaded '+(now.substring(14,16)-time.substring(14,16)) + 'minutes ago';
    } else if(time.substring(17,19)-now.substring(17,19) != 0){
        return 'uploaded '+(now.substring(17,19)-time.substring(17,19)) + 'seconds ago';
    } else if(now.substring(20,23)-time.substring(20,23) != 0){
        return 'uploaded '+'now';
    }
}

function buildHtml(result, res) {
  var style = '<link rel="stylesheet" href="css/gallery.css" type="text/css">'
  var first = true;
  var pages = result.length
  var indices = '<div class="pagination">\n'
  for (var i = 0; i < pages; i++){
      file = '/public/html/'+result[i].email+'_'+result[i].title+'.html';
      indices = indices + '    <a href="'+ file +'">' + i +'</a> \n'
  }
  indices = indices + '</div>'
  for(var record of result){
      var header = '<h2>' + record.title +'<\h2>';
      var body = '';
      var names = record.filename.split(";")
      names = names.splice(0, names.length-1);
      var email = record.email
      var timeDiff = time_diff(record.date)

      for(var name of names){
          var fullname = email + '_' + name;
          var img = '<div class="gallery"> \n'
            + '<img src="'+ path.resolve('./uploads/') + '/'+fullname + '" width="600" height="400">'
            + '<div class="name">'
            + name.substring(0, name.length-4) + ', ' + timeDiff
            + '</div>'
            + '</div>\n'
           var body = body + img
      }
      var content = '<!DOCTYPE html>'
      + '<html><head>' + header + '</head>'+ style +'<body>' + body + indices + '</body></html>';
      var filepath = '/public/html/'+record.email+'_'+record.title+'.html';
      fs.writeFile('.'+filepath, content, err => {
          if(err)
              return console.error(err);
          else if(first) {
              first = false;
              res.sendFile(path.resolve('./')+filepath);
          }
      });
  }
};

module.exports = buildHtml;
