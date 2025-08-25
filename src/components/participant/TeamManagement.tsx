import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Users, Plus, Mail, UserCheck, UserX, Crown } from 'lucide-react';
import { useApi } from '@/hooks/useApi';
import { toast } from 'sonner';

interface TeamManagementProps {
  user: any;
  teams: any[];
  onTeamUpdate: () => void;
}

const TeamManagement: React.FC<TeamManagementProps> = ({ user, teams, onTeamUpdate }) => {
  const [showCreateTeam, setShowCreateTeam] = useState(false);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [showAddMemberModal, setShowAddMemberModal] = useState(false);
  const [selectedTeam, setSelectedTeam] = useState<any>(null);
  const [teamName, setTeamName] = useState('');
  const [teamDescription, setTeamDescription] = useState('');
  const [inviteEmail, setInviteEmail] = useState('');
  const [memberEmail, setMemberEmail] = useState('');
  const [allUsers, setAllUsers] = useState([]);
  const api = useApi();

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      const users = await api.getAllUsers();
      setAllUsers(users);
    } catch (error) {
      console.error('Failed to load users:', error);
    }
  };

  const handleCreateTeam = async () => {
    if (!teamName.trim()) {
      toast.error('Team name is required');
      return;
    }

    try {
      await api.createTeam({
        name: teamName,
        description: teamDescription,
        leaderId: user._id,
        eventId: null // Can be set later when joining events
      });
      toast.success('Team created successfully!');
      setShowCreateTeam(false);
      setTeamName('');
      setTeamDescription('');
      onTeamUpdate();
    } catch (error: any) {
      toast.error(error.message || 'Failed to create team');
    }
  };

  const handleInviteToTeam = async () => {
    if (!inviteEmail.trim()) {
      toast.error('Email is required');
      return;
    }

    try {
      await api.inviteToTeam(selectedTeam._id, inviteEmail, user._id);
      toast.success('Invitation sent successfully!');
      setShowInviteModal(false);
      setInviteEmail('');
      onTeamUpdate();
    } catch (error: any) {
      toast.error(error.message || 'Failed to send invitation');
    }
  };

  const handleAcceptInvite = async (teamId: string, inviteId: string) => {
    try {
      await api.joinTeam(teamId, user._id, inviteId);
      toast.success('Successfully joined team!');
      onTeamUpdate();
    } catch (error: any) {
      toast.error(error.message || 'Failed to join team');
    }
  };

  const handleDeclineInvite = async (teamId: string, inviteId: string) => {
    try {
      await api.declineInvite(teamId, inviteId);
      toast.success('Invitation declined');
      onTeamUpdate();
    } catch (error: any) {
      toast.error(error.message || 'Failed to decline invitation');
    }
  };

  const handleAddMember = async () => {
    if (!memberEmail.trim()) {
      toast.error('Email is required');
      return;
    }

    try {
      await api.addTeamMember(selectedTeam._id, memberEmail, user._id);
      toast.success('Member added successfully!');
      setShowAddMemberModal(false);
      setMemberEmail('');
      onTeamUpdate();
    } catch (error: any) {
      toast.error(error.message || 'Failed to add member');
    }
  };

  const handleRemoveMember = async (teamId: string, memberId: string) => {
    try {
      await api.removeTeamMember(teamId, memberId, user._id);
      toast.success('Member removed successfully!');
      onTeamUpdate();
    } catch (error: any) {
      toast.error(error.message || 'Failed to remove member');
    }
  };

  const getUserTeams = () => teams.filter(team => team.members?.includes(user._id));
  const getPendingInvites = () => {
    const invites: any[] = [];
    teams.forEach(team => {
      team.invites?.forEach((invite: any) => {
        if (invite.email === user.email && invite.status === 'pending') {
          invites.push({ ...invite, teamName: team.name, teamId: team._id });
        }
      });
    });
    return invites;
  };

  const userTeams = getUserTeams();
  const pendingInvites = getPendingInvites();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Team Management</h2>
          <p className="text-muted-foreground">Create teams, invite members, and collaborate</p>
        </div>
        <Dialog open={showCreateTeam} onOpenChange={setShowCreateTeam}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Create Team
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Team</DialogTitle>
              <DialogDescription>
                Create a team to collaborate with other participants
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="teamName">Team Name</Label>
                <Input
                  id="teamName"
                  value={teamName}
                  onChange={(e) => setTeamName(e.target.value)}
                  placeholder="Enter team name"
                />
              </div>
              <div>
                <Label htmlFor="teamDescription">Description (Optional)</Label>
                <Input
                  id="teamDescription"
                  value={teamDescription}
                  onChange={(e) => setTeamDescription(e.target.value)}
                  placeholder="Brief description of your team"
                />
              </div>
              <div className="flex gap-2">
                <Button onClick={handleCreateTeam} disabled={api.loading}>
                  {api.loading ? 'Creating...' : 'Create Team'}
                </Button>
                <Button variant="outline" onClick={() => setShowCreateTeam(false)}>
                  Cancel
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Pending Invites */}
      {pendingInvites.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Mail className="h-5 w-5" />
              Pending Invitations
            </CardTitle>
            <CardDescription>
              You have {pendingInvites.length} pending team invitation(s)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {pendingInvites.map((invite) => (
                <div key={invite.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <p className="font-medium">{invite.teamName}</p>
                    <p className="text-sm text-muted-foreground">
                      Invited by {invite.invitedBy}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button 
                      size="sm" 
                      onClick={() => handleAcceptInvite(invite.teamId, invite.id)}
                      disabled={api.loading}
                    >
                      <UserCheck className="h-4 w-4 mr-1" />
                      Accept
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => handleDeclineInvite(invite.teamId, invite.id)}
                      disabled={api.loading}
                    >
                      <UserX className="h-4 w-4 mr-1" />
                      Decline
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* User's Teams */}
      <div className="grid gap-6 md:grid-cols-2">
        {userTeams.map((team) => (
          <Card key={team._id}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  {team.name}
                </CardTitle>
                {team.leaderId === user._id && (
                  <Badge variant="secondary">
                    <Crown className="h-3 w-3 mr-1" />
                    Leader
                  </Badge>
                )}
              </div>
              {team.description && (
                <CardDescription>{team.description}</CardDescription>
              )}
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-medium mb-2">Members ({team.members?.length || 0})</h4>
                <div className="space-y-2">
                  {team.members?.map((memberId: string, index: number) => {
                    const memberUser = allUsers.find((u: any) => u._id === memberId);
                    return (
                      <div key={index} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-sm font-medium">
                            {(memberUser?.name || memberId).charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <span className="text-sm font-medium">{memberUser?.name || 'Unknown User'}</span>
                            <p className="text-xs text-muted-foreground">{memberUser?.email}</p>
                          </div>
                          {team.leaderId === memberId && (
                            <Crown className="h-3 w-3 text-yellow-500" />
                          )}
                        </div>
                        {team.leaderId === user._id && team.leaderId !== memberId && (
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleRemoveMember(team._id, memberId)}
                            disabled={api.loading}
                          >
                            <UserX className="h-3 w-3" />
                          </Button>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {team.invites && team.invites.length > 0 && (
                <div>
                  <h4 className="font-medium mb-2">Pending Invites</h4>
                  <div className="space-y-1">
                    {team.invites.filter((invite: any) => invite.status === 'pending').map((invite: any, index: number) => (
                      <div key={index} className="text-sm text-muted-foreground flex items-center gap-2">
                        <Mail className="h-3 w-3" />
                        {invite.email}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {team.leaderId === user._id && (
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => {
                      setSelectedTeam(team);
                      setShowAddMemberModal(true);
                    }}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Member
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => {
                      setSelectedTeam(team);
                      setShowInviteModal(true);
                    }}
                  >
                    <Mail className="h-4 w-4 mr-2" />
                    Send Invite
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {userTeams.length === 0 && pendingInvites.length === 0 && (
        <div className="text-center py-12">
          <Users className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">No teams yet</h3>
          <p className="text-muted-foreground mb-4">
            Create a team or wait for invitations to start collaborating
          </p>
          <Button onClick={() => setShowCreateTeam(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Create Your First Team
          </Button>
        </div>
      )}

      {/* Add Member Modal */}
      <Dialog open={showAddMemberModal} onOpenChange={setShowAddMemberModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Team Member</DialogTitle>
            <DialogDescription>
              Add a member directly to {selectedTeam?.name}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="memberEmail">Email Address</Label>
              <Input
                id="memberEmail"
                type="email"
                value={memberEmail}
                onChange={(e) => setMemberEmail(e.target.value)}
                placeholder="Enter email address"
              />
            </div>
            <div className="flex gap-2">
              <Button onClick={handleAddMember} disabled={api.loading}>
                {api.loading ? 'Adding...' : 'Add Member'}
              </Button>
              <Button variant="outline" onClick={() => setShowAddMemberModal(false)}>
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Invite Modal */}
      <Dialog open={showInviteModal} onOpenChange={setShowInviteModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Invite Team Member</DialogTitle>
            <DialogDescription>
              Send an invitation to join {selectedTeam?.name}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="inviteEmail">Email Address</Label>
              <Input
                id="inviteEmail"
                type="email"
                value={inviteEmail}
                onChange={(e) => setInviteEmail(e.target.value)}
                placeholder="Enter email address"
              />
            </div>
            <div className="flex gap-2">
              <Button onClick={handleInviteToTeam} disabled={api.loading}>
                {api.loading ? 'Sending...' : 'Send Invitation'}
              </Button>
              <Button variant="outline" onClick={() => setShowInviteModal(false)}>
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TeamManagement;