export interface IParticipationFunctionAddedEvent {
  functionId: string;
}

export interface IParticipationFunctionRemovedEvent {
  functionId: string;
}

export interface IParticipationFunctionUpdatedEvent {
  functionId: string;
}

export interface IConnectedUserAddedEvent {
  userId: string;
}

export interface IConnectedUserRemovedEvent {
  userId: string;
}
export interface IProcessEndEvent{
  participationId: string;
}
export interface IProcessStartEvent{
  participationId: string;
}
