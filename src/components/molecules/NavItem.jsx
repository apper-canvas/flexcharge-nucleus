import { NavLink } from 'react-router-dom'
import { motion } from 'framer-motion'
import ApperIcon from '@/components/ApperIcon'

const NavItem = ({ to, icon, label, isActive }) => {
  return (
    <NavLink
      to={to}
      className={({ isActive: linkActive }) =>
        `flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 relative ${
          linkActive
            ? 'bg-gradient-to-r from-primary/20 to-secondary/20 text-white border-r-2 border-primary'
            : 'text-gray-400 hover:text-white hover:bg-white/10'
        }`
      }
    >
      {({ isActive: linkActive }) => (
        <>
          {linkActive && (
            <motion.div
              layoutId="activeNav"
              className="absolute left-0 top-0 w-1 h-full bg-gradient-to-b from-primary to-secondary rounded-r-full"
            />
          )}
          
          <ApperIcon 
            name={icon} 
            className={`w-5 h-5 transition-colors duration-200 ${
              linkActive ? 'text-primary' : 'text-gray-400'
            }`} 
          />
          
          <span className="font-medium">{label}</span>
        </>
      )}
    </NavLink>
  )
}

export default NavItem