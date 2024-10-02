import {AuthedWebSocket} from "../../auth/auth.gateway";

export class GameUser {
    private lastUpdate: number;
    private lookingForOpponent: boolean;
    private lookingForOpponentNeon: boolean;
    private inGame: boolean;

    constructor(private socket: AuthedWebSocket) {
        this.lastUpdate = Date.now();
        this.lookingForOpponent = false;
        this.lookingForOpponentNeon = false;
        this.inGame = false;
    }

    getSocket(): AuthedWebSocket {
        return this.socket;
    }

    updateUser() {
        this.lastUpdate = Date.now();
    }

    setLookingForOpponent(lookingForOpponent: boolean) {
        this.lookingForOpponent = lookingForOpponent;
    }

    isLookingForOpponent(): boolean {
        return this.lookingForOpponent;
    }

    setLookingForOpponentNeon(lookingForOpponentNeon: boolean) {
        this.lookingForOpponentNeon = lookingForOpponentNeon;
    }

    isLookingForOpponentNeon(): boolean {
        return this.lookingForOpponentNeon;
    }
    setInGame(inGame: boolean) {
        this.inGame = inGame;
    }

    isInGame(): boolean {
        return this.inGame;
    }

    setLastUpdate(lastUpdate: number) {
        this.lastUpdate = lastUpdate;
    }

    isActive(): boolean {
        return Date.now() - this.lastUpdate <= 1000 * 5;
    }

    getId(): string {
        return this.socket.user.id;
    }

}
