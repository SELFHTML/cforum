# -*- coding: utf-8 -*-

class CfCloseVotesVoter < ActiveRecord::Base
  self.primary_key = 'close_votes_voter_id'
  self.table_name  = 'close_votes_voters'

  belongs_to :close_votes, class_name: CfCloseVote

  validates :user_id, presence: true
  validates_uniqueness_of :user_id, scope: :close_vote_id
end

# eof
