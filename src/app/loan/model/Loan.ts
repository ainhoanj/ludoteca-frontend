import { Client } from '../../client/model/Client';
import { Game } from '../../game/model/Game';

export interface Loan {
    id: number;
    client: Client;
    game: Game;
    startDate: string;
    endDate: string;
}