import Hero from '../components/home/Hero'
import Intro from '../components/home/Intro'
import ProjectsGallery from '../components/home/ProjectsGallery'
import Manifesto from '../components/home/Manifesto'
import ServicesGrid from '../components/home/ServicesGrid'
import ProcessSection from '../components/home/ProcessSection'
import TrustSection from '../components/home/TrustSection'
import Testimonials from '../components/home/Testimonials'
import CTAFinal from '../components/home/CTAFinal'

const Home = () => (
  <main>
    <Hero />
    <Intro />
    <ProjectsGallery />
    <Manifesto />
    <ServicesGrid />
    <ProcessSection />
    <TrustSection />
    <Testimonials />
    <CTAFinal />
  </main>
)

export default Home
