import { Link } from "react-router-dom"

const Navbar = () => {
  return (
    <section className="flex justify-center p-4 bg-green-900 shadow-xl text-white sticky top-0 z-50">
        <ul className="flex gap-4">
            <Link to='/'>Home</Link>
            <Link to='pokemons'>Pokemons</Link>
            <Link to='about'>About</Link>
        </ul>
    </section>
  )
}

export default Navbar