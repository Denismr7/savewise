using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace Savewise.Models
{
    public class TransactionType
    {
        public int? ttId { get; set; }
        public string ttName { get; set; }

        public List<Transaction> Transactions { get; set; }
    }

    public class TransactionTypeConfig : IEntityTypeConfiguration<TransactionType>
    {
        public void Configure(EntityTypeBuilder<TransactionType> builder)
        {
            builder.ToTable("transactiontypes");

            builder.Property(tt => tt.ttId)
                   .HasColumnName("tt_id")
                   .HasColumnType("int")
                   .ValueGeneratedOnAdd()
                   .IsRequired();

            builder.Property(tt => tt.ttName)
                   .HasColumnName("tt_name")
                   .HasColumnType("varchar")
                   .HasMaxLength(15)
                   .IsRequired();
        }
    }
}