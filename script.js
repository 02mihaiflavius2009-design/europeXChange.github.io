function SetUpAboutUs() {
    const FrontPageImageEls = document.querySelectorAll(".FrontPage-imgCommunImg")
    const FrontPageImageElsDivs = document.querySelectorAll(".FrontPage-communImg")

    const FrontPageImagesFolder = "./images/FrontPageImages"
    const FrontPageImages = []

    let index = 1
    let startIndex = 0

    let inTween = false
    let imgFullScreened = null

    const interval = 5000
    const fadeTime = 500


    function SetUpImageEls() {

        FrontPageImageElsDivs.forEach((el, i) => {

            el.addEventListener("click", () => {

                if ((inTween || imgFullScreened) && imgFullScreened !== el)
                    return

                imgFullScreened = (!el.classList.contains("fullScreenPhoto")) ? el : null

                el.classList.toggle("fullScreenPhoto")
                el.classList.toggle(`FrontPage-img${i+1}`)

            })

        })

    }



    function loadNextImageInSetUp() {

        const img = new Image()
        const path = `${FrontPageImagesFolder}/img${index}.png`

        img.onload = () => {
            FrontPageImages.push(path)
            index++
            loadNextImageInSetUp()
        }

        img.onerror = () => {

            setTimeout(() => {
                loadFrontPageImages()
                setInterval(loadFrontPageImages, interval)
            }, interval)

        }

        img.src = path
    }


    function loadFrontPageImages() {

        if (FrontPageImages.length === 0) return
        if (imgFullScreened) return

        const elCount = FrontPageImageEls.length

        isTweening = true

        for (let i = 0; i < elCount; i++) {

            const imgEl = FrontPageImageEls[i]

            imgEl.style.opacity = 0

            setTimeout(() => {

                const imgIndex = (startIndex + i) % FrontPageImages.length

                imgEl.src = FrontPageImages[imgIndex]
                imgEl.style.opacity = 1

            }, fadeTime)

        }

        setTimeout(() => {
            isTweening = false
        }, fadeTime)

        startIndex = (startIndex + elCount) % FrontPageImages.length

    }



    loadNextImageInSetUp()
    SetUpImageEls()
}


function SetUpEuropeWhyX() {
    const wrapper = document.querySelector(".carousel-wrapper");
    const carousel = document.querySelector(".imgCaroussel");
    const slideGap = 40;
    const slideWidth = 300;

    let isAnimating = false;

    const originals = Array.from(carousel.children);
    const total = originals.length;

    originals.forEach(s => carousel.appendChild(s.cloneNode(true)));
    [...originals].reverse().forEach(s => carousel.prepend(s.cloneNode(true)));

    let domIndex = total;



    const text = "Why Choose EuropeXchange?";
    const EXTitle = document.querySelector(".EXTitle");
    const EXDesc = document.querySelector(".EXDesc");

    let index = 0;
    let started = false;

    function typeEffect() {
        if (index < text.length) {
            EXTitle.innerHTML += text.charAt(index);
            index++;
            setTimeout(typeEffect, 50);
        }
    }

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !started) {
                EXTitle.innerHTML = ""
                started = true;
                typeEffect();

                setTimeout(()=>{
                    EXDesc.style.opacity = 1
                }, 1500)
            }
        });
    });

    observer.observe(EXTitle);




    function getOffset(i) {
        const wrapperWidth = wrapper.offsetWidth;
        const itemFull = slideWidth + slideGap;
        const slideLeft = i * itemFull;
        return slideLeft - (wrapperWidth / 2) + (slideWidth / 2);
    }

    function updateActive() {
        const all = Array.from(carousel.querySelectorAll(".communimgC"));
        all.forEach((s, i) => s.classList.toggle("active", i === domIndex));
    }

    function moveTo(newDomIndex, animated = true) {
        domIndex = newDomIndex;
        const offset = getOffset(domIndex);
        carousel.style.transition = animated ? "transform 0.5s ease" : "none";
        carousel.style.transform = `translateX(-${offset}px)`;
        updateActive();
    }

    moveTo(domIndex, false);

    carousel.addEventListener("transitionend", () => {
        isAnimating = false;

        if (domIndex >= total * 2 || domIndex < total) {
            const all = carousel.querySelectorAll(".communimgC");
            all.forEach(s => s.style.transition = "none");

            if (domIndex >= total * 2) {
                domIndex = domIndex - total;
            } else {
                domIndex = domIndex + total;
            }

            moveTo(domIndex, false);

            requestAnimationFrame(() => {
                requestAnimationFrame(() => {
                    all.forEach(s => s.style.transition = "");
                });
            });
        }
    });

    function nextSlide() {
        if (isAnimating) return;
        isAnimating = true;
        moveTo(domIndex + 1, true);
    }

    setInterval(nextSlide, 2500);
}

function SetUpReviews() {
    const track = document.querySelector(".ReviewsTrack");
    if (!track) return;

    const cardWidth = 340;
    const gap = 32;
    const step = cardWidth + gap;

    // Clone all originals once to fill the visible area + buffer
    const originals = Array.from(track.children);
    originals.forEach(card => track.appendChild(card.cloneNode(true)));

    let offset = 0;
    let lastTime = null;
    const speed = 80; // px per second

    function getCards() {
        return Array.from(track.children);
    }

    function animate(timestamp) {
        if (!lastTime) lastTime = timestamp;
        const delta = (timestamp - lastTime) / 1000;
        lastTime = timestamp;

        offset += speed * delta;

        // When the first card has fully left the screen, remove it and append a clone at the end
        const cards = getCards();
        if (offset >= step) {
            offset -= step;

            const first = cards[0];
            // Clone it and append to end before removing
            track.appendChild(first.cloneNode(true));
            first.remove();
        }

        track.style.transform = `translateX(-${offset}px)`;
        requestAnimationFrame(animate);
    }

    // Pause on hover
    let paused = false;
    track.addEventListener("mouseenter", () => paused = true);
    track.addEventListener("mouseleave", () => paused = false);

    function loop(timestamp) {
        if (!paused) {
            animate(timestamp);
        } else {
            lastTime = null;
            requestAnimationFrame(loop);
            return;
        }
        requestAnimationFrame(loop);
    }

    // Avoid double calls — use a clean single loop
    let rafId = null;

    function tick(timestamp) {
        if (!paused) {
            if (!lastTime) lastTime = timestamp;
            const delta = (timestamp - lastTime) / 1000;
            lastTime = timestamp;

            offset += speed * delta;

            const cards = getCards();
            if (offset >= step) {
                offset -= step;
                const first = cards[0];
                track.appendChild(first.cloneNode(true));
                first.remove();
            }

            track.style.transform = `translateX(-${offset}px)`;
        } else {
            lastTime = null;
        }

        rafId = requestAnimationFrame(tick);
    }

    requestAnimationFrame(tick);
}


SetUpAboutUs()
SetUpEuropeWhyX()

SetUpReviews();