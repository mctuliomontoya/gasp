"use client"
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import {useRef, useEffect} from "react";

const FirstAnimation = () => {
  const container = useRef(null);
  useGSAP(() => {
    gsap.to(".box", {x: 200})
  }, {scope: container});

  return (
    <div ref={container}>
      <div className="box gradient-red font-bold">Box</div>
    </div>
  )
}

const CircleOnClick = () => {
  const container = useRef(null);
  const { contextSafe } = useGSAP({scope: container});

  const handleClick = contextSafe(() => {
    gsap.to(".circle", {x: 200})
  })

  const handleHover = contextSafe(() => {

    const tl = gsap.timeline({paused: true});
    tl.to(".text", {
      duration: 0.2,
      yPercent: -150,
      ease: "power2.in"
    })
    tl.set(".text", { yPercent: 150 })
    tl.to(".text", { duration: 0.2 , yPercent: 0 })

    tl.play(0)
  })

  return (
    <div ref={container}>
      <div onMouseEnter={handleHover} onClick={handleClick} className="circle gradient-red font-bold cursor-pointer">
        <span className="text">Safe</span>
      </div>
    </div>
  )
}

const Nested = () => {
  const container = useRef(null)
  useGSAP(() => {
    gsap.from('.circle', {
      scale: 0,
      duration: 1,
      repeat: -1,
      ease: "power2.inOut",
      yoyo: true,
      stagger: {
        each: 0.2
      }
    })
  }, {scope: container})
  return (
    <div className="nested flex gap-2 flex-row font-bold" ref={container}>
      <div className="circle gradient-blue">1</div>
      <div className="circle gradient-blue">2</div>
      <div className="circle gradient-blue">3</div>
      <div className="circle gradient-blue">4</div>
      <div className="circle gradient-blue">5</div>
    </div>
  )
}

const ConSafe = () => {
  const container = useRef(null);
  const buttonRef = useRef<HTMLAnchorElement>(null);
  const flairRef = useRef<HTMLSpanElement>(null);

  const { contextSafe } = useGSAP({scope: container});

  const onClickGood = contextSafe(() => {
    gsap.to('.box', {rotation: "+=360"});
  })

  useEffect(() => {
    if (!buttonRef.current || !flairRef.current) return;

    const button = buttonRef.current;
    const flair = flairRef.current;

    const xSet = gsap.quickSetter(flair, "xPercent");
    const ySet = gsap.quickSetter(flair, "yPercent");

    const getXY = (e: MouseEvent) => {
      const {
        left,
        top,
        width,
        height
      } = button.getBoundingClientRect();

      const xTransformer = gsap.utils.pipe(
        gsap.utils.mapRange(0, width, 0, 100),
        gsap.utils.clamp(0, 100)
      );

      const yTransformer = gsap.utils.pipe(
        gsap.utils.mapRange(0, height, 0, 100),
        gsap.utils.clamp(0, 100)
      );

      return {
        x: xTransformer(e.clientX - left),
        y: yTransformer(e.clientY - top)
      };
    };

    const handleMouseEnter = contextSafe((e: MouseEvent) => {
      const { x, y } = getXY(e);

      xSet(x);
      ySet(y);

      gsap.to(flair, {
        scale: 1,
        duration: 0.4,
        ease: "power2.out"
      });
    });

    const handleMouseLeave = contextSafe((e: MouseEvent) => {
      const { x, y } = getXY(e);

      gsap.killTweensOf(flair);

      gsap.to(flair, {
        xPercent: x > 90 ? x + 20 : x < 10 ? x - 20 : x,
        yPercent: y > 90 ? y + 20 : y < 10 ? y - 20 : y,
        scale: 0,
        duration: 0.3,
        ease: "power2.out"
      });
    });

    const handleMouseMove = contextSafe((e: MouseEvent) => {
      const { x, y } = getXY(e);

      gsap.to(flair, {
        xPercent: x,
        yPercent: y,
        duration: 0.4,
        ease: "power2"
      });
    });

    button.addEventListener("mouseenter", handleMouseEnter);
    button.addEventListener("mouseleave", handleMouseLeave);
    button.addEventListener("mousemove", handleMouseMove);

    return () => {
      button.removeEventListener("mouseenter", handleMouseEnter);
      button.removeEventListener("mouseleave", handleMouseLeave);
      button.removeEventListener("mousemove", handleMouseMove);
    };
  }, [contextSafe]);

  return (
    <div ref={container} className="flex flex-col items-center">
      <a ref={buttonRef} onClick={onClickGood} className="button button--stroke mb-3" data-block="button">
        <span ref={flairRef} className="button__flair"></span>
        <span className="button__label">Click Me</span>
      </a>

      <div className="box gradient-green font-bold">Context safe</div>
    </div>
  );
}

function App() {
  return (
    <div className="App bg-gray-950 flex flex-col items-center justify-center min-h-[100vh]
    ">
      <FirstAnimation />
      <div className="my-4"></div>
      <CircleOnClick />
      <div className="my-4"></div>
      <Nested />
      <div className="my-4"></div>
      <ConSafe />
      <div className="box gradient-green mt-4 font-bold">Box 2</div>
    </div>
  )
}

export default App;