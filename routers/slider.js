export const slider = (container, nextBtn, prevBtn) => {
  container.forEach((item, i) => {
    let containerDimensions = item.getBoundingClientRect();
    let containerWidth = containerDimensions.width;
    nextBtn.addEventListener('click', () => {
      item.scrollLeft += containerWidth;
    });
    prevBtn.addEventListener('click', () => {
      item.scrollLeft -= containerWidth;
    });
  });
};
