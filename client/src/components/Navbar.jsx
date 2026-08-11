// 1. React Router se "Link" ko import kar rahe hain. 
// Ye bilkul HTML ke <a> (anchor) tag jaisa hota hai.
import { Link } from 'react-router-dom'; 

const Navbar = () => {
  return (
    // 2. p-4: Padding charo taraf se. bg-[#111111]: Custom dark background color.
    // border-b border-gray-800: Navbar ke niche ek halki si grey line (border) deta hai.
    // justify-between: Ek item left (Logo) me, doosra item right (Links) me chala jayega.
    <nav className="flex items-center justify-between p-4 bg-[#111111] border-b border-gray-800">
      
      {/* 3. Ye aapka Logo ya brand name hai */}
      <div className="text-2xl font-bold text-white">CodeNest</div>
      
      {/* 4. Ye Links container hai. gap-4: Dono links ke beech me thoda space dega */}
      <div className="flex gap-4">
        
        {/* 5. <Link to="/"> ka matlab hai: Agar koi ispe click kare toh usko Home page par bhej do.
            hover:text-white: Jab ispe mouse layenge toh grey se white color ka ho jayega. 
            transition: Color change smooth hoga (jhatke se nahi). */}
        <Link to="/" className="text-gray-300 hover:text-white transition">Home</Link>
        <Link to="/login" className="text-gray-300 hover:text-white transition">Login</Link>
      </div>
    </nav>
  )
}

export default Navbar;
