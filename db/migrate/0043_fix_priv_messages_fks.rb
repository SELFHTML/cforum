# -*- coding: utf-8 -*-

class FixPrivMessagesFks < ActiveRecord::Migration
  def up
    execute <<-SQL
ALTER TABLE priv_messages ALTER COLUMN sender_id DROP NOT NULL;
ALTER TABLE priv_messages ALTER COLUMN recipient_id DROP NOT NULL;
    SQL
  end

  def down
    execute <<-SQL
ALTER TABLE priv_messages ALTER COLUMN sender_id SET NOT NULL;
ALTER TABLE priv_messages ALTER COLUMN recipient_id SET NOT NULL;
    SQL
  end
end

# eof
