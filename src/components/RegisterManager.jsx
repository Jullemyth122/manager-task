import React, { useEffect, useRef } from 'react'
import '../scss/signup.scss'
import { Draggable } from 'gsap/all';
import gsap from 'gsap';
import { useAuth } from '../context/useAuth';
import { Link } from 'react-router-dom';
gsap.registerPlugin(Draggable)
const RegisterAdmin = () => {

    const containerRef = useRef(null);
    const circRef = useRef(null);
    const gradientRef = useRef(null);
    const btnRef = useRef(null);

    const { 
        
        email, setEmail, password, setPassword, username, setUsername,
        errorMessage, setErrorMessage, successMessage, setSuccessMessage,
        handleRegister

      } = useAuth();

    useEffect(() => {
        const container = containerRef.current;
        const circ = circRef.current;
        const gradient = gradientRef.current;
        const btn = btnRef.current;

        const containerWidth = container.offsetWidth;
        const circWidth = circ.offsetWidth;
        const initLeft = circ.offsetLeft;

        // Calculate maximum horizontal displacement allowed.
        const maxX = containerWidth - circWidth - initLeft;

        Draggable.create(circ, {
        type: 'x',
        bounds: container,
        onDrag: function () {

            const progress = gsap.utils.clamp(0, 1, this.x / maxX);

            gsap.to(gradient, { width: progress * 100 + '%', duration: 0.1, ease: 'linear' });

            gsap.to(btn, { backgroundPosition: `${progress * 100}% center`, duration: 0.1, ease: 'linear' });
        },
        onDragEnd: function () {
            const progress = gsap.utils.clamp(0, 1, this.x / maxX);
            if (progress > 0.5) {
                gsap.to(circ, { x: maxX, duration: 0.3, ease: 'power2.out' });
                gsap.to(gradient, { width: '100%', duration: 0.3, ease: 'power2.out' });
                gsap.to(btn, { 
                    backgroundPosition: `100% center`, 
                    duration: 0.3, 
                    ease: 'power2.out',
                    onComplete: async() => {
                        await handleRegister();
                        gsap.to(circ, { x: 0, duration: 0.3, ease: 'power2.out' });
                        gsap.to(gradient, { width: '0%', duration: 0.3, ease: 'power2.out' });
                        gsap.to(btn, { backgroundPosition: `0% center`, duration: 0.3, ease: 'power2.out', onComplete: async() =>{

                        }});                
                        
                    }

                });
            } else {
                gsap.to(circ, { x: 0, duration: 0.3, ease: 'power2.out' });
                gsap.to(gradient, { width: '0%', duration: 0.3, ease: 'power2.out' });
                gsap.to(btn, { backgroundPosition: `0% center`, duration: 0.3, ease: 'power2.out' });
            }
        }
        });
    }, [handleRegister]);
    

    useEffect(() => {
        if (successMessage) {
            const timer = setTimeout(() => {
            setSuccessMessage("");
            }, 5000); // Clear after 3000ms (3 seconds)
            return () => clearTimeout(timer);
        }
    }, [successMessage]);

    useEffect(() => {
        if (errorMessage) {
            const timer = setTimeout(() => {
            setErrorMessage("");
            }, 5000); // Clear after 3000ms (3 seconds)
            return () => clearTimeout(timer);
        }
    }, [errorMessage]);



    return (
        <div className='signup-comp'>
            <div className="headline">
                <div className="line"></div>
                <div className="title-task">
                    <h1 className="ti-h1"> M A N 4 G E R </h1>    
                    <h1 className='ti-h2'> M A N 4 G E R </h1>    
                </div>
                <div className="line"></div>
            </div>             
            <div className="content-banner w-full flex items-end justify-center"> 
                <div className="outside-show-content w full flex items-end justify-center relative">
                    <div className="ellipse elip1"></div>
                    <div className="ellipse elip2"></div>
                    <div className="show-content relative">
                        
                        <div className="ellipse elip1"></div>
                        <div className="ellipse elip2"></div> 


                        <div className="title">
                            <h1>
                                Register
                            </h1>
                        </div>

                        <div className="input-item">
                            <label htmlFor=""> Email </label>
                            <input type="text" placeholder='mythical@gmail.com' value={email} onChange={e => setEmail(e.target.value)} />
                        </div>
                        <div className="input-item">
                            <label htmlFor=""> Username </label>
                            <input type="text" placeholder='John Doe' value={username}  onChange={e => setUsername(e.target.value)}/>
                        </div>
                        <div className="input-item">
                            <label htmlFor=""> Password </label>
                            <input type="password" placeholder='myth****33' value={password} onChange={e => setPassword(e.target.value)} />
                        </div>

                        {errorMessage && <p className="error-message">{errorMessage}</p>}
                        {successMessage && <p className="success-message">{successMessage}</p>} {/* Display success message */}


                        <div className="button-area flex items-center justify-center relative" ref={containerRef}>
                            {/* Gradient overlay element */}
                            <div className="gradient-bg" ref={gradientRef}></div>
                            {/* Draggable arrow */}
                            <div className="circ cursor-pointer" ref={circRef}>
                                <svg width="23" height="16" viewBox="0 0 23 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path
                                    fillRule="evenodd"
                                    clipRule="evenodd"
                                    d="M15.7862 0.842188L22.1931 7.16286C22.5863 7.55073 22.5906 8.18388 22.2027 8.57704L15.8821 14.984C15.4942 15.3772 14.861 15.3815 14.4679 14.9936C14.0747 14.6057 14.0704 13.9726 14.4583 13.5794L19.0835 8.89109L0.49811 9.01709L0.484551 7.01714L19.0699 6.89113L14.3816 2.26596C13.9884 1.87809 13.9841 1.24494 14.372 0.851776C14.7599 0.458613 15.393 0.45432 15.7862 0.842188Z"
                                    fill="white"
                                />
                                </svg>
                            </div>
                            <button className="btn-login" ref={btnRef}> Register </button>
                        </div>

                        <div className="alter-sign">
                            <Link to={'/loginmanager'}>
                                <h1>
                                    Go To Login
                                </h1>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>     
        </div>
    )
}

export default RegisterAdmin