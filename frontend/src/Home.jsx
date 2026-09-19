import { Link } from "react-router-dom";
import {
    MapPin,
    ShieldCheck,
    Clock,
    ArrowRight,
    Hospital,
    ShoppingBag,
    Ticket,
    GraduationCap,
    Car,
    ParkingSquare,
    CheckCircle2,
} from "lucide-react";

import "./home.css";

function Home() {
    const token = localStorage.getItem("access_token");

    return (
        <div className="home-page">

            {/* NAVBAR */}
            <nav className="home-navbar">

                <Link to="/" className="home-logo">
                    <div className="logo-icon">
                        <ParkingSquare size={24} />
                    </div>

                    <span>
                        Smart<span>Park</span>
                    </span>
                </Link>

                <div className="home-nav-links">

                    <a href="#venues">Parking Areas</a>

                    <a href="#features">Features</a>

                    <a href="#how-it-works">How It Works</a>

                    {token ? (
                        <Link
                            to="/dashboard"
                            className="nav-login"
                        >
                            Dashboard
                        </Link>
                    ) : (
                        <>
                            <Link
                                to="/login"
                                className="nav-login"
                            >
                                Login
                            </Link>

                            <Link
                                to="/signup"
                                className="nav-signup"
                            >
                                Get Started
                            </Link>
                        </>
                    )}

                </div>

            </nav>


            {/* HERO */}
            <section className="hero-section">

                <div className="hero-content">

                    <div className="hero-badge">
                        <span className="live-dot"></span>

                        Smart parking for every destination
                    </div>


                    <h1>
                        Find Your Spot.
                        <br />

                        <span>Park Smarter.</span>
                    </h1>


                    <p>
                        Find available parking spaces and reserve
                        your slot before you arrive. SmartPark makes
                        parking simple at hospitals, malls, events,
                        schools, and more.
                    </p>


                    <div className="hero-buttons">

                        <Link
                            to={token ? "/dashboard" : "/login"}
                            className="primary-button"
                        >
                            Find Parking
                            <ArrowRight size={19} />
                        </Link>

                        <a
                            href="#how-it-works"
                            className="secondary-button"
                        >
                            How it works
                        </a>

                    </div>


                    <div className="hero-trust">

                        <div>
                            <CheckCircle2 size={17} />
                            Real-time availability
                        </div>

                        <div>
                            <CheckCircle2 size={17} />
                            Easy booking
                        </div>

                        <div>
                            <CheckCircle2 size={17} />
                            Secure reservations
                        </div>

                    </div>

                </div>


                {/* PARKING VISUAL */}
                <div className="parking-visual">

                    <div className="visual-glow"></div>

                    <div className="parking-board">

                        <div className="board-header">

                            <div>

                                <span className="board-small">
                                    SMART PARKING
                                </span>

                                <h3>
                                    Find Available Slots
                                </h3>

                            </div>

                            <MapPin size={22} />

                        </div>


                        <div className="parking-road">

                            <div className="parking-row">

                                <div className="slot available">
                                    A1
                                </div>

                                <div className="slot available">
                                    A2
                                </div>

                                <div className="slot occupied">
                                    A3
                                </div>

                                <div className="slot available">
                                    A4
                                </div>

                            </div>


                            <div className="road-line">
                                <Car size={34} />
                            </div>


                            <div className="parking-row">

                                <div className="slot available">
                                    B1
                                </div>

                                <div className="slot selected">
                                    B2
                                </div>

                                <div className="slot available">
                                    B3
                                </div>

                                <div className="slot occupied">
                                    B4
                                </div>

                            </div>

                        </div>


                        <div className="parking-legend">

                            <span>
                                <i className="legend-dot available-dot"></i>
                                Available
                            </span>

                            <span>
                                <i className="legend-dot selected-dot"></i>
                                Selected
                            </span>

                            <span>
                                <i className="legend-dot occupied-dot"></i>
                                Occupied
                            </span>

                        </div>

                    </div>


                    {/* FLOATING AVAILABILITY CARD */}
                    <div className="availability-card">

                        <div className="availability-icon">
                            <ParkingSquare size={20} />
                        </div>

                        <div>
                            <strong>45 Spots</strong>
                            <span>Available now</span>
                        </div>

                        <div className="availability-check">
                            <CheckCircle2 size={20} />
                        </div>

                    </div>

                </div>

            </section>


            {/* VENUES */}
            <section
                id="venues"
                className="venues-section"
            >

                <div className="section-heading">

                    <span>PARK WHERE YOU NEED</span>

                    <h2>
                        One platform. Every destination.
                    </h2>

                    <p>
                        Find convenient parking wherever
                        you're heading.
                    </p>

                </div>


                <div className="venue-grid">

                    <div className="venue-card">

                        <div className="venue-icon hospital">
                            <Hospital size={28} />
                        </div>

                        <h3>Hospitals</h3>

                        <p>
                            Convenient parking for patients,
                            visitors, and staff.
                        </p>

                    </div>


                    <div className="venue-card">

                        <div className="venue-icon mall">
                            <ShoppingBag size={28} />
                        </div>

                        <h3>Malls</h3>

                        <p>
                            Find a parking space before
                            your shopping trip.
                        </p>

                    </div>


                    <div className="venue-card">

                        <div className="venue-icon event">
                            <Ticket size={28} />
                        </div>

                        <h3>Events</h3>

                        <p>
                            Reserve parking before arriving
                            at busy events.
                        </p>

                    </div>


                    <div className="venue-card">

                        <div className="venue-icon school">
                            <GraduationCap size={28} />
                        </div>

                        <h3>Schools</h3>

                        <p>
                            Convenient parking for students,
                            staff, and visitors.
                        </p>

                    </div>

                </div>

            </section>


            {/* FEATURES */}
            <section
                id="features"
                className="features-section"
            >

                <div className="section-heading">

                    <span>WHY SMARTPARK?</span>

                    <h2>
                        Parking made effortless.
                    </h2>

                    <p>
                        Everything you need for a smoother
                        parking experience.
                    </p>

                </div>


                <div className="feature-grid">

                    <div className="feature-card">

                        <div className="feature-icon">
                            <MapPin />
                        </div>

                        <h3>
                            Find Nearby Parking
                        </h3>

                        <p>
                            Discover available parking
                            locations near your destination.
                        </p>

                    </div>


                    <div className="feature-card">

                        <div className="feature-icon">
                            <Clock />
                        </div>

                        <h3>
                            Save Your Time
                        </h3>

                        <p>
                            Check availability and reserve
                            your slot before you arrive.
                        </p>

                    </div>


                    <div className="feature-card">

                        <div className="feature-icon">
                            <ShieldCheck />
                        </div>

                        <h3>
                            Secure Booking
                        </h3>

                        <p>
                            Your parking reservation is
                            securely managed by SmartPark.
                        </p>

                    </div>

                </div>

            </section>


            {/* HOW IT WORKS */}
            <section
                id="how-it-works"
                className="how-section"
            >

                <div className="section-heading">

                    <span>HOW IT WORKS</span>

                    <h2>
                        Park in three simple steps.
                    </h2>

                </div>


                <div className="steps">

                    <div className="step">

                        <div className="step-number">
                            01
                        </div>

                        <h3>Find</h3>

                        <p>
                            Choose a parking location
                            near your destination.
                        </p>

                    </div>


                    <div className="step">

                        <div className="step-number">
                            02
                        </div>

                        <h3>Reserve</h3>

                        <p>
                            Select an available slot
                            and confirm your booking.
                        </p>

                    </div>


                    <div className="step">

                        <div className="step-number">
                            03
                        </div>

                        <h3>Park</h3>

                        <p>
                            Arrive at your reserved slot
                            and park with confidence.
                        </p>

                    </div>

                </div>

            </section>


            {/* CTA */}
            <section className="cta-section">

                <div>

                    <h2>
                        Ready to park smarter?
                    </h2>

                    <p>
                        Find and reserve your parking
                        space today.
                    </p>

                </div>


                <Link
                    to={token ? "/dashboard" : "/signup"}
                    className="cta-button"
                >
                    Get Started
                    <ArrowRight size={19} />
                </Link>

            </section>


            {/* FOOTER */}
            <footer className="home-footer">

                <div className="home-logo">

                    <div className="logo-icon">
                        <ParkingSquare size={21} />
                    </div>

                    <span>
                        Smart<span>Park</span>
                    </span>

                </div>

                <p>
                    Smart parking for smarter journeys.
                </p>

                <span className="copyright">
                    © 2026 SmartPark. All rights reserved.
                </span>

            </footer>

        </div>
    );
}

export default Home;