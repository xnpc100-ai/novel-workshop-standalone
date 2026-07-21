-- 创建评论点赞表
CREATE TABLE comment_likes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  comment_id UUID NOT NULL REFERENCES comments(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(comment_id, user_id)
);

-- 启用RLS
ALTER TABLE comment_likes ENABLE ROW LEVEL SECURITY;

-- 匿名用户可读
CREATE POLICY anon_select_comment_likes ON comment_likes
  FOR SELECT
  USING (true);

-- 登录用户可插入
CREATE POLICY users_insert_comment_likes ON comment_likes
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- 登录用户可删除自己的点赞
CREATE POLICY users_delete_own_comment_likes ON comment_likes
  FOR DELETE
  USING (auth.uid() = user_id);

-- 添加索引提升查询性能
CREATE INDEX idx_comment_likes_comment_id ON comment_likes(comment_id);
CREATE INDEX idx_comment_likes_user_id ON comment_likes(user_id);
