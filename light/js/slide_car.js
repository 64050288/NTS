$(function () {
  /* 1) ใส่ background ให้ทุก .bg (ไม่ไปยุ่งกับ display) */
  $('.bg').each(function () {
    const src = $(this).data('bg');
    $(this).css({
      'background-image': 'url(' + src + ')',
      'background-size': 'cover',
      'background-position': 'center'
    });
  });

  /* 2) สำหรับแต่ละรายการ (listing) ให้ซ่อนทุกภาพก่อน แล้วโชว์ภาพแรก */
  $('.geodir-category-listing').each(function () {
    const $wrap = $(this);
    const $imgs = $wrap.find('.geodir-category-img .bg');
    if ($imgs.length) {
      $imgs.hide().first().show();
      $wrap.data('slider-index', 0);
    }
  });

  /* 3) เปลี่ยนสไลด์ */
  function changeSlide($wrap, dir) {
    const $imgs = $wrap.find('.geodir-category-img .bg');
    if (!$imgs.length) return;
    let idx = $wrap.data('slider-index') || 0;
    idx = (idx + dir + $imgs.length) % $imgs.length;
    $imgs.hide().eq(idx).show();
    $wrap.data('slider-index', idx);
  }

  /* 4) ปุ่ม next/prev – อ้างอิง container ของ listing */
  $(document).on('click', '.fw-carousel-button-next', function (e) {
    e.preventDefault();
    changeSlide($(this).closest('.geodir-category-listing'), +1);
  });
  $(document).on('click', '.fw-carousel-button-prev', function (e) {
    e.preventDefault();
    changeSlide($(this).closest('.geodir-category-listing'), -1);
  });
});
