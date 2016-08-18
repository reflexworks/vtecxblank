var MPUploader;

MPUploader = (function() {

  MPUploader.prototype.xhr = null;

  MPUploader.prototype.success = null;

  MPUploader.prototype.error = null;

  function MPUploader(options) {
    var ua;
    this.success = options && options.success ? options.success : null;
    this.error = options && options.error ? options.error : null;
    ua = navigator.userAgent;
    this.isChrome = ua.match(/Chrome\/\d+/g) ? true : false;
  }
  	
  MPUploader.prototype.upload = function(url, data, options) {
    var async, bin, contentType, method, packed;
    method = options && options.method ? options.method : 'POST';
    contentType = options && options.contentType ? options.contentType : 'application/x-msgpack; charset=x-user-defined';
    async = options && options.async ? options.async : true;
    this.success = options && options.success ? options.success : this.success;
    this.error = options && options.error ? options.error : this.error;

    var bin0 = zlib_asm.compress(msgpack.encode(data));
    var bin = new Uint8Array(bin0.subarray(2,bin0.length-4));	// ヘッダ(先頭2バイト)とチェックサム(末尾4バイト)を削除

//    var bin = new Uint8Array(msgpack.encode(data));
    
    this.xhr = this._setupXHR(method, url, async);
    if (options && options.responseType) {
      this.xhr.responseType = options.responseType;
    }
    this.xhr.setRequestHeader('Content-Type', contentType);
    this.xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
    this.xhr.setRequestHeader('Content-Encoding', 'deflate');

    if (this.isChrome) {
      this.xhr.send(bin);
    } else {
      this.xhr.send(bin.buffer);
    }
    return this.xhr;
  };

  MPUploader.prototype._setupXHR = function(method, url, async, load) {
    var xhr,
      _this = this;
    xhr = this._createXHR();
    if (xhr === null) {
      throw new Error('This browser is not supported XHR.');
    }
    xhr.open(method, url, async);
    if (load === true) {
      xhr.responseType = 'arraybuffer';
    }
    xhr.onreadystatechange = function() {
      if (xhr.readyState === 4) {
        if (xhr.status === 200 || xhr.status === 304) {
          if (_this.success) {
            return _this.success.apply(_this, [xhr.response]);
          }
        } else {
          if (_this.error) {
            return _this.error.apply(_this, [xhr]);
          }
        }
      } else {
        if (_this.xhr.status !== 200 && _this.xhr.status !== 304) {
          return _this.error.apply(_this, [xhr]);
        }
      }
    };
    return xhr;
  };

  MPUploader.prototype._createXHR = function() {
    if (window.ActiveXObject) {
      try {
        return new ActiveXObject("Msxml2.XMLHTTP");
      } catch (e) {
        try {
          return new ActiveXObject("Microsoft.XMLHTTP");
        } catch (e) {
          return null;
        }
      }
    } else if (window.XMLHttpRequest) {
      return new XMLHttpRequest();
    } else {
      return null;
    }
  };

  MPUploader.prototype.destory = function() {
    this.xhr = null;
    this.success = null;
    return this.error = null;
  };

  return MPUploader;

})();