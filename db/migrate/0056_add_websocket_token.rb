# -*- coding: utf-8 -*-

class AddWebsocketToken < ActiveRecord::Migration
  def up
    execute <<-SQL
ALTER TABLE users ADD COLUMN websocket_token CHARACTER VARYING(250) UNIQUE;
    SQL
  end

  def down
    execute <<-SQL
ALTER TABLE users DROP COLUMN websocket_token;
    SQL
  end
end

# eof
