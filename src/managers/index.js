import ProductsManager from "./mongo/productsManager.js";
import CartManager from "./mongo/cartsManager.js";
import UserManager from "./mongo/UserManager.js";
import TicketManager from "./mongo/ticketManager.js";

const productsService = new ProductsManager()
const cartsService = new CartManager()
const usersService = new UserManager()
const ticketService = new TicketManager()

export { productsService, cartsService, usersService, ticketService };