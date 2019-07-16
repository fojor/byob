import { Injectable } from '@angular/core';

@Injectable()
export class HelperService {

  constructor() { }

  // BYOB.service('HelperService', ['$state', function($state) {
  safeApply(scope, fn) {
    (scope.$$phase || scope.$root.$$phase) ? fn() : scope.$apply(fn);
  }

  // need to fix variables name and what this func really do
  // secondsToTime(seconds) {
  //   seconds = parseFloat(seconds.toFixed(2));
  //   let hours = Math.floor(seconds / 3600);
  //   let minutes = Math.floor((seconds - (hours * 3600)) / 60);
  //   var seconds = seconds - (hours * 3600) - (minutes * 60);
  //   seconds = seconds.toFixed(2);
  //   if (hours < 10) { hours = "0" + hours; }
  //   if (minutes < 10) { minutes = "0" + minutes; }
  //   if (seconds < 10) { seconds = "0" + seconds; }
  //   return hours + ':' + minutes + ':' + seconds;
  // };

  timeToSeconds(time) {
    let time_arr = time.split(':');
    let dur = 0;
    let t = [3600, 60, 1];

    for (let i in time_arr) {
      dur += (parseFloat(time_arr[i]) * t[i]);
    }
    return dur;
  }

  parseDate(dateTime) {
    let date = new Date(dateTime);
    let year = date.getFullYear();
    let month = date.getMonth() + 1;
    let getDate = date.getDate();

    console.log("getDate +'/'+ month +'/'+ year", getDate + '/' + month + '/' + year);
    return getDate + '/' + month + '/' + year;
  }

  // routeList(type) {
  //   let states = $state.get();
  //   let state_paths = [];
  //   let state_names = [];

  //   for (let state in states) {
  //     if (states[state].abstract)
  //       continue;
  //     state_names.push(states[state].name);
  //     state_paths.push(states[state].url);
  //   }

  //   if (type == 'name') {
  //     //remove first element from an array, which gives empty string...
  //     state_names.splice(0, 1);
  //     return state_names;
  //   } else {
  //     //remove first element from an array, which gives "^" string...
  //     state_paths.splice(0, 1);
  //     return state_paths;
  //   }

  // }



  getArray(length) {
    let arr = [];
    for (let i = 1; i <= length; i++) {
      arr.push(i)
    }
    return arr;
  }

  dataURItoBlob(dataURI) {
    // convert base64/URLEncoded data component to raw binary data held in a string
    let byteString;

    if (dataURI.split(',')[0].indexOf('base64') >= 0) {
      byteString = atob(dataURI.split(',')[1]);
    } else {
      byteString = unescape(dataURI.split(',')[1]);
    }

    // separate out the mime component
    let mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];
    // write the bytes of the string to a typed array
    let ia = new Uint8Array(byteString.length);

    for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }
    return new Blob([ia], { type: mimeString });
  }



  resample_hermite(canvas, W, H, W2, H2) {

    var time1 = Date.now();
    W2 = Math.round(W2);
    H2 = Math.round(H2);
    var img = canvas.getContext("2d").getImageData(0, 0, W, H);
    var img2 = canvas.getContext("2d").getImageData(0, 0, W2, H2);
    var data = img.data;
    var data2 = img2.data;
    var ratio_w = W / W2;
    var ratio_h = H / H2;
    var ratio_w_half = Math.ceil(ratio_w / 2);
    var ratio_h_half = Math.ceil(ratio_h / 2);

    for (var j = 0; j < H2; j++) {
      for (var i = 0; i < W2; i++) {
        var x2 = (i + j * W2) * 4;
        var weight = 0;
        var weights = 0;
        var weights_alpha = 0;
        var gx_r = 0, gx_g = 0, gx_b = 0, gx_a = 0; //my variation of daclare and asigning
        var center_y = (j + 0.5) * ratio_h;
        for (var yy = Math.floor(j * ratio_h); yy < (j + 1) * ratio_h; yy++) {
          var dy = Math.abs(center_y - (yy + 0.5)) / ratio_h_half;
          var center_x = (i + 0.5) * ratio_w;
          var w0 = dy * dy //pre-calc part of w
          for (var xx = Math.floor(i * ratio_w); xx < (i + 1) * ratio_w; xx++) {
            var dx = Math.abs(center_x - (xx + 0.5)) / ratio_w_half;
            var w = Math.sqrt(w0 + dx * dx);
            if (w >= -1 && w <= 1) {
              //hermite filter
              weight = 2 * w * w * w - 3 * w * w + 1;
              if (weight > 0) {
                dx = 4 * (xx + yy * W);
                //alpha
                gx_a += weight * data[dx + 3];
                weights_alpha += weight;
                //colors
                if (data[dx + 3] < 255)
                  weight = weight * data[dx + 3] / 250;
                gx_r += weight * data[dx];
                gx_g += weight * data[dx + 1];
                gx_b += weight * data[dx + 2];
                weights += weight;
              }
            }
          }
        }
        data2[x2] = gx_r / weights;
        data2[x2 + 1] = gx_g / weights;
        data2[x2 + 2] = gx_b / weights;
        data2[x2 + 3] = gx_a / weights_alpha;
      }
    }

    console.log("hermite = " + (Math.round(Date.now() - time1) / 1000) + " s");
    canvas.getContext("2d").clearRect(0, 0, Math.max(W, W2), Math.max(H, H2));
    canvas.width = W2;
    canvas.height = H2;
    canvas.getContext("2d").putImageData(img2, 0, 0);
  };

  getImageMimeTypes() {
    return ['image/png', 'image/jpeg', 'image/gif', 'image/tif', 'image/tiff'];
  };

  getVideoMimeTypes() {
    /*3g2 (Mobile Video)
    3gp (Mobile Video)
    3gpp (Mobile Video)
    asf (Windows Media Video)
    avi (AVI Video)
    dat (MPEG Video)
    divx (DIVX Video)
    dv (DV Video)
    f4v (Flash Video)
    flv (Flash Video)
    m2ts (M2TS Video)
    m4v (MPEG-4 Video)
    mkv (Matroska Format)
    mod (MOD Video)
    mov (QuickTime Movie)
    mp4 (MPEG-4 Video)
    mpe (MPEG Video)
    mpeg (MPEG Video)
    mpeg4 (MPEG-4 Video)
    mpg (MPEG Video)
    mts (AVCHD Video)
    nsv (Nullsoft Video)
    ogm (Ogg Media Format)
    ogv (Ogg Video Format)
    qt (QuickTime Movie)
    tod (TOD Video)
    ts (MPEG Transport Stream)
    vob (DVD Video)
    wmv (Windows Media Video)*/
    return [
      'application/annodex',
      'application/mp4',
      'application/ogg',
      'application/vnd.rn-realmedia',
      'application/x-matroska',
      'video/3gpp',
      'video/3gpp2',
      'video/annodex',
      'video/divx',
      'video/flv',
      'video/h264',
      'video/mp4',
      'video/mp4v-es',
      'video/mpeg',
      'video/mpeg-2',
      'video/mpeg4',
      'video/ogg',
      'video/ogm',
      'video/quicktime',
      'video/ty',
      'video/vdo',
      'video/vivo',
      'video/vnd.rn-realvideo',
      'video/vnd.vivo',
      'video/webm',
      'video/x-bin',
      'video/x-cdg',
      'video/x-divx',
      'video/x-dv',
      'video/x-flv',
      'video/x-la-asf',
      'video/x-m4v',
      'video/x-matroska',
      'video/x-motion-jpeg',
      'video/x-ms-asf',
      'video/x-ms-dvr',
      'video/x-ms-wm',
      'video/x-ms-wmv',
      'video/x-msvideo',
      'video/x-sgi-movie',
      'video/x-tivo',
      'video/avi',
      'video/x-ms-asx',
      'video/x-ms-wvx',
      'video/x-ms-wmx'
    ];
  }

  getDocumentMimeTypes() {
    return [
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/vnd.ms-word.document.macroEnabled.12',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.template',
      'application/vnd.ms-word.template.macroEnabled.12',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'application/vnd.ms-excel.sheet.macroEnabled.12',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.template',
      'application/vnd.ms-excel.template.macroEnabled.12',
      'application/vnd.ms-excel.sheet.binary.macroEnabled.12',
      'application/vnd.ms-excel.addin.macroEnabled.12',
      'application/vnd.openxmlformats-officedocument.presentationml.presentation',
      'application/vnd.ms-powerpoint.presentation.macroEnabled.12',
      'application/vnd.openxmlformats-officedocument.presentationml.slideshow',
      'application/vnd.ms-powerpoint.slideshow.macroEnabled.12',
      'application/vnd.openxmlformats-officedocument.presentationml.template',
      'application/vnd.ms-powerpoint.template.macroEnabled.12',
      'application/vnd.ms-powerpoint.addin.macroEnabled.12',
      'application/vnd.openxmlformats-officedocument.presentationml.slide',
      'application/vnd.ms-powerpoint.slide.macroEnabled.12',
      'application/msonenote',
      'application/vnd.ms-officetheme',
      'application/vnd.ms-powerpoint',
      'application/msword',
      'application/vnd.ms-excel',
      'application/pdf',
      'text/rtf'
    ];
  }

  serverSideErrors(data) {
    let errors = [];
    if (data.errorMessage != undefined) {
      errors.push(data.errorMessage);
    }
    if (data.responseData != undefined) {
      for (let error in data.responseData) {
        if (Array.isArray(data.responseData[error])) {
          for (let i = 0; i < data.responseData[error].length; i++) {
            errors.push(data.responseData[error][i]);
          }
        }
      }
    }
    console.log('errors', errors);
    return errors;
  }
  /*
  this.errorToaster = function(){
      toaster.pop({
        type: 'error',
        body: 'views/common/errors.html',
        showCloseButton: true,
        bodyOutputType: 'template'
      });
  }
  this.successToaster = function(message){
      toaster.pop({
        type: 'success',
        body: message,
        showCloseButton: true,
      });
  }*/

  // }]);

}
