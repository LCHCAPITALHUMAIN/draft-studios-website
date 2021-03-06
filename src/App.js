// just playing around... written for Adobe CF Summit 2018 @ Las Vegas, NV
// best considered a test bed to convey some high level ideas
// WHERE CAN WE GO FROM HERE? 
//  render optimizations
//  better variable naming
//  dynamic viewport sizing -> kinda like how charting has dynamic axis
//  add in real multi-player control (right now CF is emulating the user through websockets)
//  animations are only dependent on X-axis movement... maybe add jumping, flying, diving mechanics, etc...
//  maybe bring in a motion/animation library... react-motion... get out of the box spring and motion mechanics... mine are way simple
//  maybe bring in react-draggable if we want to implement some drag and drop ability into the "game"... currently the only action we're monitoring and using is scroll
//  parallax x prop should probably be true starting X position... right now parallax factor is applied even when object is not on screen 
//  ~ explain this: parallax ratio probably should not go into effect until object linearly crosses screen
//  sound effects: fireworks, walking, cars/taxis/train...
//  have cf control other avatars that are a class between Person and Parallax
//  move WebSocket initialization from FetchColdFusionAssets.js to App.js - this buys us more flexibility, and WebSocket can change things on that level: Canvas (background, etc).
//  move fetch() also to App.js for same reason. 
//
//
// TOPICS NOT COVERED THAT ARE IMPORTANT IN YOUR LEARNING?
//  controlled/uncontrolled components (does the component need to be state aware)
//  higher order components (wrappers)
//  routing
//  server rendering
//  data flow and state management: Redux/Flux/RxJS/vanilla/axios/fetch... too many options

import React, { Component } from 'react';
import './App.css';
import Canvas from './Canvas';
import Person from './Person';
import Floor from './Floor';
import Parallax from './Parallax';
import Fireworks from './Fireworks';
import Notification from './Notification';
import FetchColdFusionAssets from './FetchColdFusionAssets';

// test
import EventComponent from './EventComponent'; 

class App extends Component {

  constructor(props) {
    super(props);
      //https://stackoverflow.com/questions/43817118/how-to-get-the-width-of-a-react-element
    this.myCanvas = React.createRef();
    this.state = {
        floor: "20vh",
        street: "20vh",
        deltaMode: 0,
        deltaY: 0,
        currentPosition: 0,
        freeze: 0,
        shaking: false,
        mode: "dc",
    };
  }

  componentDidMount() {
    document.addEventListener('keydown', this.handleKeys);
      //window.addEventListener('scroll', this.handleWheel, true);
    window.addEventListener('resize', this.resize);

    const viewportWidth = this.myCanvas.current.offsetWidth;
      //console.log("vw:", viewportWidth);

      this.setState({
        vw: viewportWidth
      });
  }

  componentWillUnmount() {
    document.removeEventListener('keydown', this.handleKeys);
      //window.removeEventListener('scroll', this.handleWheel);
    window.removeEventListener('resize', this.resize);
  }

  componentDidUpdate(prevState) {
    if (this.state.freeze !== prevState.freeze && this.state.freeze === 1) {
        setTimeout(this.switchModes, 3000);
    }
  }

  resize = () => {
    this.forceUpdate();
    const viewportWidth = this.myCanvas.current.offsetWidth;

    this.setState({
      vw: viewportWidth
    });
  }
  
  switchModes = () => {          
    const currentMode = this.state.mode;
    this.setState({
        mode: currentMode === "dc" ? "vegas" : currentMode === "vegas" ? "boston" : "dc",
        freeze: 0,
        currentPosition: 0,
        deltaMode: 0,
        deltaY: 0,
    });
  }

  shouldPersonJump = (e) => {
    // look at the current canvas and objects and determine if Person needs to jump
    console.log(e);
  }

  handleWheel = (e, maxscroll, frozen) => {
      const currentposition = this.state.currentPosition;
      //console.log(e.deltaMode, e.deltaX, e.deltaY, e.deltaZ)

      if (!frozen) {
          this.setState({
              deltaMode: e.deltaMode,
              deltaY: e.deltaY + Math.random(), // fix rate-limited scrolling browsers
              currentPosition: currentposition+e.deltaY > 0 ? (currentposition+e.deltaY > maxscroll ? maxscroll : currentposition + e.deltaY) : 0, 
              freeze: currentposition+e.deltaY > maxscroll ? 1 : 0,
          });
          this.shouldPersonJump(e);
      }

      // checking this since swipe won't be a real wheel event. also want to prevent regular scroll behaviors
      //if (e.preventDefault) e.preventDefault();
      //if (e.stopPropagation) e.stopPropagation();
  }

  handleKeys = (e) => {
      const currentposition = this.state.currentPosition;
      // currently handeKeys will allow you to bypass teleporter :) unhandled easter egg 
      
      if (e.key === "ArrowRight" || e.key === "ArrowDown") {
        this.setState({
            deltaMode: 0,
            deltaY: 100 + Math.random(),
            currentPosition: currentposition+100 > 0 ? currentposition + 100 : 0, 
        });
      } else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
        this.setState({
            deltaMode: 0,
            deltaY: -100 + Math.random(),
            currentPosition: currentposition-100 > 0 ? currentposition - 100 : 0, 
        });
      }
  }

  startWorldBossShake = () => {
      // a anti-pattern but we're fooling around...
        this.setState({
            shaking: true 
        }, () => setTimeout(() => { 
            this.setState(() => ({shaking: false}));
          }, 10000)
        );
  }

  updateFloorState = (flr) => {
        this.setState({
          floor: flr
        });
  }

  render() {
    const scrollChange = this.state.deltaY;
    const vegasMaxScroll = 8300 - this.state.vw / 2 + 150; //basically total asset width minus half the viewport and adjust by person width
    const bostonMaxScroll = 9800 - this.state.vw / 2 + 150;
    const dcMaxScroll = 8300 - this.state.vw / 2 + 150; //basically total asset width minus half the viewport and adjust by person width

    const pos = this.state.currentPosition;
    const freeze = this.state.freeze;
    const shaking = this.state.shaking ? " worldboss-shake " : " ";
    const mode = this.state.mode;

    return (
        //https://stackoverflow.com/questions/43817118/how-to-get-the-width-of-a-react-element
        <div ref={this.myCanvas}>

        <EventComponent>
        {

        (mode === "dc" && 
        <Canvas mode={mode} className={shaking} tabIndex="1" key="canvas3" scroll={(e) => freeze ? this.handleWheel(e, dcMaxScroll, true) : this.handleWheel(e, dcMaxScroll) }> {/* this is how i'll handle max scroll */}
            {/* dc!!! */}


            {/* buildings!!! */}

            {/*
            <Parallax move={pos} x="200" animationclass="vegas-sign-glow-slides" floor={this.state.floor} ratio="1" opacity="1" color="transparent" asset="Spacer.png"/>
            */}

            <Parallax move={pos} x="0" floor={this.state.floor} ratio="1" opacity="1" color="transparent" asset="DC-Washington-Level.png"/>
            <Parallax move={pos} x="8190" floor={this.state.floor} ratio="1" opacity="1" color="transparent" asset="DC-Washington-Level-Rpt.png"/>
            <Fireworks move={pos} x="0" y="0" width="1500" ratio="1"/>

            {/* clouds!!! */}
            <Parallax move={pos} x="250" y="25" ratio="0.5" opacity="0.3" asset="DC-Cloud-1.png" color="transparent"/>
            <Parallax move={pos} x="340" y="200" ratio="2" opacity="0.4" asset="DC-Cloud-2.png" color="transparent"/>
            <Parallax move={pos} x="870" y="100" ratio="1.25" opacity="0.4" asset="DC-Cloud-3.png" color="transparent"/>
            <Parallax move={pos} x="1350" y="50" ratio="0.75" opacity="0.5" asset="DC-Cloud-4.png" color="transparent"/>
            <Parallax move={pos} x="1650" y="125" ratio="2.25" opacity="0.2" asset="DC-Cloud-5.png" color="transparent"/>
            <Parallax move={pos} x="2250" y="50" ratio="0.75" opacity="0.5" asset="DC-Cloud-6.png" color="transparent"/>
            <Parallax move={pos} x="2750" y="80" ratio="1.25" opacity="0.2" asset="DC-Cloud-2.png" color="transparent"/>
            <Parallax move={pos} x="2850" y="10" ratio="0.15" opacity="0.6" asset="DC-Cloud-3.png" color="transparent"/>
            <Parallax move={pos} x="3350" y="50" ratio="0.95" opacity="0.5" asset="DC-Cloud-4.png" color="transparent"/>
            <Parallax move={pos} x="3750" y="80" ratio="1.25" opacity="0.2" asset="DC-Cloud-6.png" color="transparent"/>
            <Parallax move={pos} x="4350" y="50" ratio="0.85" opacity="0.5" asset="DC-Cloud-3.png" color="transparent"/>
            <Parallax move={pos} x="4650" y="125" ratio="2.15" opacity="0.2" asset="DC-Cloud-2.png" color="transparent"/>
            <Parallax move={pos} x="4850" y="10" ratio="0.35" opacity="0.6" asset="DC-Cloud-1.png" color="transparent"/>
            <Parallax move={pos} x="6750" y="80" ratio="1.15" opacity="0.2" asset="DC-Cloud-3.png" color="transparent"/>
            <Parallax move={pos} x="10250" y="25" ratio="0.5" opacity="0.3" asset="DC-Cloud-1.png" color="transparent"/>
            <Parallax move={pos} x="10340" y="200" ratio="0.4" opacity="0.4" asset="DC-Cloud-2.png" color="transparent"/>
            <Parallax move={pos} x="10870" y="100" ratio="0.3" opacity="0.4" asset="DC-Cloud-3.png" color="transparent"/>
            <Parallax move={pos} x="101350" y="50" ratio="0.25" opacity="0.5" asset="DC-Cloud-4.png" color="transparent"/>

            {/* birds!!! */}
            <Parallax move={pos} x="100" floor={this.state.floor} color="transparent" ratio="0.75" asset="Bird-1.png" imgclass="bird"/>
            <Parallax move={pos} x="1000" floor={this.state.floor} color="transparent" ratio="1.5" asset="Bird-2.png" imgclass="bird"/>
            <Parallax move={pos} x="5100" floor={this.state.floor} color="transparent" ratio="0.75" asset="Bird-1.png" imgclass="bird"/>
            <Parallax move={pos} x="51000" floor={this.state.floor} color="transparent" ratio="1.5" asset="Bird-2.png" imgclass="bird"/>
            <Parallax move={pos} x="7000" floor={this.state.floor} color="transparent" ratio="0.75" asset="Bird-1.png" imgclass="bird"/>
            <Parallax move={pos} x="8000" floor={this.state.floor} color="transparent" ratio="1.5" asset="Bird-2.png" imgclass="bird"/>

            <Parallax move={pos} x="100" floor={this.state.floor} color="transparent" ratio="1" asset="DC-Crowd-1-Slides.png" imgclass="crowd"/>
            <Parallax move={pos} x="400" floor={this.state.floor} color="transparent" ratio="1" asset="DC-Crowd-12-Slides.png" imgclass="crowd-2"/>
            <Parallax move={pos} x="1100" floor={this.state.floor} color="transparent" ratio="1" asset="DC-Crowd-2-Slides.png" imgclass="crowd-3"/>
            <Parallax move={pos} x="2100" floor={this.state.floor} color="transparent" ratio="1" asset="DC-Crowd-3-Slides.png" imgclass="crowd"/>
            <Parallax move={pos} x="3100" floor={this.state.floor} color="transparent" ratio="1" asset="DC-Crowd-4-Slides.png" imgclass="crowd-3"/>
            <Parallax move={pos} x="2300" floor={this.state.floor} color="transparent" ratio="1" asset="DC-Crowd-5-Slides.png" imgclass="crowd"/>
            <Parallax move={pos} x="4500" floor={this.state.floor} color="transparent" ratio="1" asset="DC-Crowd-6-Slides.png" imgclass="crowd-2"/>
            <Parallax move={pos} x="4700" floor={this.state.floor} color="transparent" ratio="1" asset="DC-Crowd-7-Slides.png" imgclass="crowd"/>
            <Parallax move={pos} x="3050" floor={this.state.floor} color="transparent" ratio="1" asset="DC-Crowd-8-Slides.png" imgclass="crowd-3"/>
            <Parallax move={pos} x="2750" floor={this.state.floor} color="transparent" ratio="1" asset="DC-Crowd-9-Slides.png" imgclass="crowd-2"/>
            <Parallax move={pos} x="3140" floor={this.state.floor} color="transparent" ratio="1" asset="DC-Crowd-10-Slides.png" imgclass="crowd-3"/>
            <Parallax move={pos} x="4000" floor={this.state.floor} color="transparent" ratio="1" asset="DC-Crowd-11-Slides.png" imgclass="crowd"/>
            <Parallax move={pos} x="3000" floor={this.state.floor} color="transparent" ratio="1" asset="DC-Crowd-12-Slides.png" imgclass="crowd-2"/>
            <Parallax move={pos} x="5000" floor={this.state.floor} color="transparent" ratio="1" asset="DC-Crowd-1-Slides.png" imgclass="crowd"/>
            <Parallax move={pos} x="5450" floor={this.state.floor} color="transparent" ratio="1" asset="DC-Crowd-12-Slides.png" imgclass="crowd-2"/>
            <Parallax move={pos} x="7100" floor={this.state.floor} color="transparent" ratio="1" asset="DC-Crowd-2-Slides.png" imgclass="crowd-3"/>
            <Parallax move={pos} x="5100" floor={this.state.floor} color="transparent" ratio="1" asset="DC-Crowd-3-Slides.png" imgclass="crowd-3"/>
            <Parallax move={pos} x="6100" floor={this.state.floor} color="transparent" ratio="1" asset="DC-Crowd-4-Slides.png" imgclass="crowd-3"/>
            <Parallax move={pos} x="6300" floor={this.state.floor} color="transparent" ratio="1" asset="DC-Crowd-5-Slides.png" imgclass="crowd"/>
            <Parallax move={pos} x="5500" floor={this.state.floor} color="transparent" ratio="1" asset="DC-Crowd-6-Slides.png" imgclass="crowd-2"/>
            <Parallax move={pos} x="8700" floor={this.state.floor} color="transparent" ratio="1" asset="DC-Crowd-7-Slides.png" imgclass="crowd"/>

            {/* coldfusion-specific !!! */}
            <FetchColdFusionAssets dc="true" move={pos} startshaking={this.startWorldBossShake} floor={this.state.street} mode={mode}/>

            {/* the floor!!! 
                    recomposing this a bit... to see if possible 
                    Ground should be its own component (probably doesn't need state does it? -- maybe for previous/current floor height)... 
                    have all the Floor objects and given a position, should find max height from all Floor objects within vicinity.
                    If max height is higher than current floor height, make Person jump

                    should also keep constant gravity... that way we won't have to keep manually tranforming Y to floor

                    if current Y not equal to current floor, animate falling frame
                */}

            <Floor key="floor3" dc="true" move={pos} x="0" maxheight={this.state.floor} ratio="1" width="17500" upd={this.updateFloorState}/>

            {/* person!!! */}
            <Person key="3" imgclass="person-slides-jimmy-dc" pos={pos} floor={this.state.floor} deltamode={this.state.deltaMode} deltay={scrollChange} maxscroll={vegasMaxScroll} />

            <Parallax move={pos} x="600" floor={this.state.floor} color="transparent" ratio="1" asset="DC-Crowd-3-Slides.png" imgclass="crowd-4"/>
            <Parallax move={pos} x="1350" floor={this.state.floor} color="transparent" ratio="1" asset="DC-Crowd-11-Slides.png" imgclass="crowd-4"/>
            <Parallax move={pos} x="3150" floor={this.state.floor} color="transparent" ratio="1" asset="DC-Crowd-6-Slides.png" imgclass="crowd-3"/>
            <Parallax move={pos} x="2370" floor={this.state.floor} color="transparent" ratio="1" asset="DC-Crowd-2-Slides.png" imgclass="crowd-4"/>
            <Parallax move={pos} x="4720" floor={this.state.floor} color="transparent" ratio="1" asset="DC-Crowd-1-Slides.png" imgclass="crowd-2"/>
            <Parallax move={pos} x="3090" floor={this.state.floor} color="transparent" ratio="1" asset="DC-Crowd-1-Slides.png" imgclass="crowd-3"/>
            <Parallax move={pos} x="3120" floor={this.state.floor} color="transparent" ratio="1" asset="DC-Crowd-5-Slides.png" imgclass="crowd-2"/>
            <Parallax move={pos} x="4090" floor={this.state.floor} color="transparent" ratio="1" asset="DC-Crowd-7-Slides.png" imgclass="crowd"/>
            <Parallax move={pos} x="5080" floor={this.state.floor} color="transparent" ratio="1" asset="DC-Crowd-3-Slides.png" imgclass="crowd"/>
            <Parallax move={pos} x="5470" floor={this.state.floor} color="transparent" ratio="1" asset="DC-Crowd-10-Slides.png" imgclass="crowd-4"/>
            <Parallax move={pos} x="7110" floor={this.state.floor} color="transparent" ratio="1" asset="DC-Crowd-4-Slides.png" imgclass="crowd"/>
            <Parallax move={pos} x="6110" floor={this.state.floor} color="transparent" ratio="1" asset="DC-Crowd-7-Slides.png" imgclass="crowd-2"/>
            <Parallax move={pos} x="6360" floor={this.state.floor} color="transparent" ratio="1" asset="DC-Crowd-11-Slides.png" imgclass="crowd-4"/>
            <Parallax move={pos} x="8750" floor={this.state.floor} color="transparent" ratio="1" asset="DC-Crowd-1-Slides.png" imgclass="crowd-2"/>

            {/* things that render in front of person!!! */}
            <Parallax move={pos} x="8100" floor={this.state.floor} ratio="1" opacity="1" color="transparent" asset="Vegas-Warning-Sign.png"/>
            <Parallax key="tele3" move={pos} x="8300" staticclass="vegas-teleporter" animationclass="vegas-teleporter-slides" animateat={vegasMaxScroll} floor={this.state.floor} ratio="1" opacity="1" color="transparent" freeze="true" asset="Spacer.png"/>
            <Notification text="Welcome to our online demo! Scroll your mouse or use the arrow keys to explore."/>
        </Canvas>
        ) ||
         
        (mode === "vegas" && 
        <Canvas mode={mode} className={shaking} tabIndex="1" key="canvas1" scroll={(e) => freeze ? this.handleWheel(e, vegasMaxScroll, true) : this.handleWheel(e, vegasMaxScroll) }> {/* this is how i'll handle max scroll */}
            {/* vegas!!! */}

            {/* background!!! */}
            <Parallax move={pos} x="0" floor={this.state.floor} ratio="0.7" opacity="0.5" asset="Vegas-Sand-Dunes.png" color="transparent"/>
            <Parallax move={pos} x="0" floor={this.state.floor} ratio="0.8" opacity="0.5" asset="Vegas-Background-Buildings.png" color="transparent"/>
            <Parallax move={pos} x="0" floor={this.state.floor} ratio="1.3" opacity="1" asset="Vegas-Back-Trees.png" color="transparent"/>
            {/*
            <Fireworks move={pos} x="0" y="0" width="1500" ratio="1"/>
            */}

            {/* buildings!!! */}
            <Parallax move={pos} x="200" animationclass="vegas-sign-glow-slides" floor={this.state.floor} ratio="1" opacity="1" color="transparent" asset="Spacer.png"/>
            <Parallax move={pos} x="1000" animationclass="vegas-luxor-slides" floor={this.state.floor} ratio="1" opacity="1" color="transparent" asset="Spacer.png"/>
            <Parallax move={pos} x="2200" animationclass="vegas-hard-rock-slides" floor={this.state.floor} ratio="1" opacity="1" color="transparent" asset="Spacer.png"/>
            <Parallax move={pos} x="3600" animationclass="vegas-statue-liberty-slides" floor={this.state.floor} ratio="1" opacity="1" color="transparent" asset="Spacer.png"/>
            <Parallax move={pos} x="4600" animationclass="vegas-eiffel-slides" floor={this.state.floor} ratio="1" opacity="1" color="transparent" asset="Spacer.png"/>
            <Parallax move={pos} x="5300" animationclass="vegas-bellagio-slides" floor={this.state.floor} ratio="1" opacity="1" color="transparent" asset="Spacer.png"/>
            <Parallax move={pos} x="7300" animationclass="vegas-stratosphere-slides" floor={this.state.floor} ratio="1" opacity="1" color="transparent" asset="Spacer.png"/>
            <Parallax move={pos} x="8200" floor={this.state.floor} ratio="1" opacity="1" color="transparent" asset="Vegas-Warning-Sign.png"/>
            <Parallax move={pos} x="8225" floor={this.state.floor} ratio="1" opacity="1" color="transparent" asset="Vegas-Warning-Sign.png"/>

            {/* clouds!!! */}
            <Parallax move={pos} x="50" y="25" ratio="0.5" opacity="0.3" asset="Cloud-Left-Large.png" color="transparent"/>
            <Parallax move={pos} x="440" y="200" ratio="2" opacity="0.4" asset="Cloud-Left-Small.png" color="transparent"/>
            <Parallax move={pos} x="770" y="100" ratio="1.25" opacity="0.4" asset="Cloud-Right-Large.png" color="transparent"/>
            <Parallax move={pos} x="1550" y="50" ratio="0.75" opacity="0.5" asset="Cloud-Right-Med.png" color="transparent"/>
            <Parallax move={pos} x="1750" y="125" ratio="2.25" opacity="0.2" asset="Cloud-Right-Small.png" color="transparent"/>
            <Parallax move={pos} x="2750" y="10" ratio="0.25" opacity="0.6" asset="Clouds-Left-Med.png" color="transparent"/>
            <Parallax move={pos} x="3750" y="80" ratio="1.25" opacity="0.2" asset="Cloud-Left-Large.png" color="transparent"/>

            {/* birds!!! */}
            <Parallax move={pos} x="100" floor={this.state.floor} color="transparent" ratio="0.75" asset="Bird-1.png" imgclass="bird"/>
            <Parallax move={pos} x="1000" floor={this.state.floor} color="transparent" ratio="1.5" asset="Bird-2.png" imgclass="bird"/>
            <Parallax move={pos} x="3400" floor={this.state.floor} color="transparent" ratio="1.5" asset="Bird-2.png" imgclass="bird"/>
            <Parallax move={pos} x="5800" floor={this.state.floor} color="transparent" ratio="0.75" asset="Bird-1.png" imgclass="bird"/>

            {/* foreground!!! */}
            <Parallax move={pos} x="0" floor={this.state.floor} ratio="1.1" opacity="1" asset="Vegas-Front-Trees.png" color="transparent"/>

            {/* coldfusion-specific !!! */}
            <FetchColdFusionAssets move={pos} startshaking={this.startWorldBossShake} floor={this.state.street} mode={mode}/>

            {/* the floor!!! 
                    recomposing this a bit... to see if possible 
                    Ground should be its own component (probably doesn't need state does it? -- maybe for previous/current floor height)... 
                    have all the Floor objects and given a position, should find max height from all Floor objects within vicinity.
                    If max height is higher than current floor height, make Person jump

                    should also keep constant gravity... that way we won't have to keep manually tranforming Y to floor

                    if current Y not equal to current floor, animate falling frame
                */}

            <div class="ground" move={pos} shouldIJump={this.shouldPersonJump}>
                <Floor move={pos} x="0" maxheight={this.state.floor} ratio="1" width="17500"/>
                <Floor move={pos} x="2000" maxheight="5vh" ratio="1" width="17500"/>
            </div>

            {/* person!!! */}
            <Person key="1" pos={pos} floor={this.state.floor} deltamode={this.state.deltaMode} deltay={scrollChange} maxscroll={vegasMaxScroll} />

            {/* things that render in front of person!!! */}
            <Parallax key="tele1" move={pos} x="8300" staticclass="vegas-teleporter" animationclass="vegas-teleporter-slides" animateat={vegasMaxScroll} floor={this.state.floor} ratio="1" opacity="1" color="transparent" freeze="true" asset="Spacer.png"/>
            <Parallax x="0" floor={this.state.street} color="transparent" ratio="1.5" asset="Taxi-Prius.png" imgclass="prius"/>
            <Notification text="This was the first stage we ever presented at Adobe Summit! Fun times."/>
        </Canvas>
        ) ||
        (mode === "boston" && 
        <Canvas mode={mode} className={shaking} tabIndex="2" key="2" scroll={(e) => freeze ? this.handleWheel(e, bostonMaxScroll, true) : this.handleWheel(e, bostonMaxScroll) }>
            {/* boston!!! */}

            {/* background!!! */}
            <Parallax move={pos} x="0" floor={this.state.floor} ratio="0.65" opacity="0.6" asset="Background-Buildings.png" color="transparent"/> 
            <Parallax move={pos} x="0" floor={this.state.floor} ratio="0.85" opacity="1" asset="Background-Trees.png" color="transparent"/> 

            {/* buildings and stuff!!! */}
            <Parallax move={pos} x="100" floor={this.state.floor} color="transparent" opacity="1" ratio="0.8" asset="Zaykim.png"/>
            <Parallax move={pos} vw={this.state.vw} x={175} popup="1" floor={this.state.floor} color="transparent" ratio="1" asset="Silo.png"/>
            <Parallax move={pos} vw={this.state.vw} x={800} popup="1" floor={this.state.floor} color="transparent" ratio="1" asset="TD-Garden.png"/>
            <Parallax move={pos} vw={this.state.vw} x={1400} popup="1" floor={this.state.floor} color="transparent" ratio="1" asset="Citgo.png"/>
            <Parallax move={pos} vw={this.state.vw} x={1600} popup="1" floor={this.state.floor} color="transparent" ratio="1" asset="Fenway.png"/>
            <Parallax move={pos} x={2200} floor={this.state.floor} color="transparent" ratio="1" asset="Commons.png"/>
            <Parallax move={pos} vw={this.state.vw} x={3050} popup="1" floor={this.state.floor} color="transparent" ratio="1" asset="State-House.png"/>
            <Parallax move={pos} vw={this.state.vw} x={3550} popup="1" floor={this.state.floor} color="transparent" ratio="1" asset="Fanieul-Hall.png"/>
            <Parallax move={pos} vw={this.state.vw} x={3950} popup="1" floor={this.state.floor} color="transparent" ratio="1" asset="City-Hall.png"/>
            <Parallax move={pos} vw={this.state.vw} x={4150} popup="1" floor={this.state.floor} color="transparent" ratio="1" asset="Library.png"/>
            <Parallax move={pos} vw={this.state.vw} x={4650} popup="1" floor={this.state.floor} color="transparent" ratio="1" asset="Trinity-Church.png"/>
            <Parallax move={pos} vw={this.state.vw} x={5250} popup="1" floor={this.state.floor} color="transparent" ratio="1" asset="Twin-Towers.png"/>
            <Parallax move={pos} vw={this.state.vw} x={5750} popup="1" floor={this.state.floor} color="transparent" ratio="1" asset="Prudential.png"/>
            <Parallax move={pos} vw={this.state.vw} x={6250} popup="1" floor={this.state.floor} color="transparent" ratio="1" asset="Hancock.png"/>
            <Parallax move={pos} vw={this.state.vw} x={6750} popup="1" floor={this.state.floor} color="transparent" ratio="1" asset="Tufts.png"/>
            <Parallax move={pos} vw={this.state.vw} x={7750} popup="1" floor={this.state.floor} color="transparent" ratio="1" asset="Chinatown.png"/>
            <Parallax move={pos} vw={this.state.vw} x={8400} popup="1" floor={this.state.floor} color="transparent" ratio="1" asset="Hotpot.png"/>
            <Parallax move={pos} x="9200" animationclass="billboard-slides" floor={this.state.floor} ratio="1" opacity="1" color="transparent" asset="Spacer.png"/>
            <Parallax move={pos} x="9650" floor={this.state.floor} ratio="1" opacity="1" color="transparent" asset="Vegas-Warning-Sign.png"/>

            {/* clouds!!! */}
            <Parallax move={pos} x="25" y="25" ratio="0.5" asset="Cloud-Left-Large.png" color="transparent"/>
            <Parallax move={pos} x="400" y="200" ratio="2" asset="Cloud-Left-Small.png" color="transparent"/>
            <Parallax move={pos} x="750" y="100" ratio="1.25" asset="Cloud-Right-Large.png" color="transparent"/>
            <Parallax move={pos} x="1450" y="50" ratio="0.75" asset="Cloud-Right-Med.png" color="transparent"/>
            <Parallax move={pos} x="1700" y="125" ratio="2.25" asset="Cloud-Right-Small.png" color="transparent"/>
            <Parallax move={pos} x="2750" y="10" ratio="0.25" asset="Clouds-Left-Med.png" color="transparent"/>
            <Parallax move={pos} x="3750" y="80" ratio="1.25" asset="Cloud-Left-Large.png" color="transparent"/>
            <Parallax move={pos} x="5025" y="25" ratio="0.5" asset="Cloud-Left-Large.png" color="transparent"/>
            <Parallax move={pos} x="5400" y="200" ratio="2" asset="Cloud-Left-Small.png" color="transparent"/>
            <Parallax move={pos} x="5750" y="100" ratio="1.25" asset="Cloud-Right-Large.png" color="transparent"/>
            <Parallax move={pos} x="6450" y="50" ratio="0.75" asset="Cloud-Right-Med.png" color="transparent"/>
            <Parallax move={pos} x="6700" y="125" ratio="2.25" asset="Cloud-Right-Small.png" color="transparent"/>
            <Parallax move={pos} x="7750" y="10" ratio="0.25" asset="Clouds-Left-Med.png" color="transparent"/>
            <Parallax move={pos} x="8750" y="80" ratio="1.25" asset="Cloud-Left-Large.png" color="transparent"/>

            {/* coldfusion specific!!! */}
            <FetchColdFusionAssets move={pos} startshaking={this.startWorldBossShake} floor={this.state.street} mode={mode}/>

            {/* this train will animate behind person!!! */}
            <Parallax x="0" floor={this.state.street} color="transparent" ratio="1.5" asset="Train.png" imgclass="train"/>

            {/* the floor!!! */}
            <Floor move={pos} x="0" maxheight={this.state.floor} ratio="1" width="20000"/>

            {/* person!!! */}
            <Person key="2" imgclass="person-slides-jimmy" pos={pos} floor={this.state.floor} deltamode={this.state.deltaMode} deltay={scrollChange} maxscroll={bostonMaxScroll} />
            
            {/* things that render in front of person!!! */}
            <Parallax move={pos} x="300" floor={this.state.floor} color="transparent" ratio="1.5" asset="Bird-2.png" imgclass="bird"/>
            <Parallax move={pos} x="2100" floor={this.state.floor} color="transparent" ratio="0.75" asset="Bird-1.png" imgclass="bird"/>
            <Parallax move={pos} x="800" floor={this.state.floor} color="transparent" ratio="0.75" asset="Bird-1.png" imgclass="bird"/>
            <Parallax move={pos} x="3000" floor={this.state.floor} color="transparent" ratio="1.5" asset="Bird-2.png" imgclass="bird"/>
            <Parallax move={pos} x="6000" floor={this.state.floor} color="transparent" ratio="0.75" asset="Bird-1.png" imgclass="bird"/>
            <Parallax move={pos} x="7100" floor={this.state.floor} color="transparent" ratio="0.75" asset="Bird-1.png" imgclass="bird"/>
            <Parallax move={pos} vw={this.state.vw} x={2640} popup="1" floor={this.state.floor} color="transparent" ratio="1" asset="Washington-Statue.png"/>
            <Parallax move={pos} vw={this.state.vw} x={8900} popup="1" floor={this.state.floor} color="transparent" ratio="1" asset="Gate.png"/>
            <Parallax x="0" floor={this.state.street} color="transparent" ratio="1.5" asset="Taxi-Camry.png" imgclass="camry"/>
            <Parallax key="tele2" move={pos} x="9800" staticclass="vegas-teleporter" animationclass="vegas-teleporter-slides" animateat={bostonMaxScroll} floor={this.state.floor} ratio="1" opacity="1" color="transparent" freeze="true" asset="Spacer.png"/>
            <Notification text="Hey, you made it to the secret stage! You'll never guess where we're from. ¯\_(ツ)_/¯"/>
        </Canvas>
        )
        }
        </EventComponent>
        </div>
    );
  }
}

export default App;
