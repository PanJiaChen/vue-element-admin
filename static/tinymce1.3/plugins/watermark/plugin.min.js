(function() {
  const qiniuOption = {
    watermark: 'aHR0cHM6Ly93ZGwud2FsbHN0cmVldGNuLmNvbS8yM2Y0ZWE2Ny1hZjI1LTQ3ZTItYTFlYy1iNzJjNzkzYWNlOGE=',
    weexWatermark: 'aHR0cHM6Ly93cGltZy53YWxsc3Rjbi5jb20vMGQxMmMwN2ItNjViMS00NjA4LTllMTctODUyMDRhOTc3YzY5',
    dissolve: 30,
    dx: 20,
    dy: 20,
    watermarkScale: 0
  };
  tinymce.create('tinymce.plugins.WaterMarkPlugin', {
    init(ed) {
      ed.addCommand('mceWaterMark', () => {
        const target = ed.selection.getNode();

        const src = $(target).attr('src') + '?watermark/1/image/' + qiniuOption.watermark + '/dissolve/' + qiniuOption.dissolve + '/gravity/Center/dx/' + qiniuOption.dx + '/dy/' + qiniuOption.dy + '/ws/' + qiniuOption.watermarkScale
        ed.windowManager.open({
          title: '七牛水印',
          width: 600,
          height: 500,
          body: [{
            type: 'container',
            html: `<div class="mce-container" hidefocus="1" tabindex="-1" >
								<div class="mce-container-body mce-container-watermark-body">
                   <div style="margin-bottom:10px;">
                      <label><input checked='true' style="margin-left: 20px;margin-right: 5px;" name="image-watermarkType" data-type="watermark" class="note-image-watermarkType" type="radio" />见闻</label>
                      <label><input style="margin-left: 20px;margin-right: 5px;" name="image-watermarkType" data-type="weexWatermark" class="note-image-watermarkType" type="radio" />WEEX</label>
                  </div>
                  <div style='min-height:600px;'>
                    <label><input style="margin-left: 20px;margin-right: 5px;" name="image-watermark" data-position="NorthWest" class="note-image-watermark" type="radio" />左上</label>
                    <label><input style="margin-left: 20px;margin-right: 5px;" name="image-watermark" data-position="SouthWest" class="note-image-watermark" type="radio" />左下</label>
                    <label><input style="margin-left: 20px;margin-right: 5px;" name="image-watermark" data-position="NorthEast" class="note-image-watermark" type="radio" /><span>右上</span></label>
                    <label><input style="margin-left: 20px;margin-right: 5px;" name="image-watermark" data-position="SouthEast" class="note-image-watermark" type="radio" /><span>右下</span></label>
                    <label><input checked='true' style="margin-left: 20px;margin-right: 5px;" name="image-watermark" data-position="Center" class="note-image-watermark" type="radio" /><span>正中央</span></label>
                    <img src=${src} style="display: block;margin: 20px auto;max-height: 420px;max-width: 100%;" class="watermark-preview">
                  </div>
								</div>
							</div>`
          }],
          onSubmit() {
            const src = $('.mce-container-watermark-body .watermark-preview').attr('src');
            $(target).attr('src', src);
            ed.undoManager.add()
            // setTimeout(() => {
            //   ed.insertContent('a')
            // }, 100);
          }
        });
        $('.mce-container-watermark-body input[type="radio"]').on('click', () => {
          const $watermarkImg = $('.mce-container-watermark-body .watermark-preview')
          const baseSrc = $watermarkImg.attr('src').split('?')[0];
          const position = $('.mce-container-watermark-body input[name="image-watermark"]:checked').attr('data-position');
          const type = $('.mce-container-watermark-body input[name="image-watermarkType"]:checked').attr('data-type');
          const query = setQuery(position, type);
          $watermarkImg.attr('src', baseSrc + query);
        })
      });


      function setQuery(postion, type) {
        return '?watermark/1/image/' + qiniuOption[type] + '/dissolve/' + qiniuOption.dissolve + '/gravity/' + postion + '/dx/' + qiniuOption.dx + '/dy/' + qiniuOption.dy + '/ws/' + qiniuOption.watermarkScale
      }

      // Register buttons
      ed.addButton('watermark', {
        title: 'watermark',
        text: '水印',
        cmd: 'mceWaterMark'
      });
    }
  });
  tinymce.PluginManager.add('watermark', tinymce.plugins.WaterMarkPlugin);
}());
