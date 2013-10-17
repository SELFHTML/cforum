# -*- encoding: utf-8 -*-

class CfPeonJob < ActiveRecord::Base
  self.primary_key = 'peon_job_id'
  self.table_name  = 'peon_jobs'

  validates_presence_of :queue_name, :class_name, :arguments
end

# eof
