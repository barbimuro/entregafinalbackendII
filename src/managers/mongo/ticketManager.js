import Ticket from "./models/ticket.model.js";

export default class TicketManager {
    async createTicket(data){
        return await Ticket.create(data)
    }
}